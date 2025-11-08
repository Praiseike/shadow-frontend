import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here');

// Stripe Checkout Form Component
const StripeCheckoutForm = ({ plan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const paymentIntentResponse = await api.createStripePaymentIntent(plan.id);
      const { clientSecret } = paymentIntentResponse;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name', // You might want to collect this
          },
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else {
        // Subscribe to plan
        await api.subscribeToPlan({
          planId: plan.id,
          paymentGateway: 'stripe',
          paymentMethodId: result.paymentIntent.payment_method
        });

        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${plan.price}`}
        </button>
      </div>
    </form>
  );
};

const PlansPage = () => {
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('paystack');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    loadPlans();
    loadUserPlan();

    // Check for Paystack callback
    const reference = searchParams.get('reference');
    if (reference) {
      handlePaystackCallback(reference);
    }
  }, [searchParams]);

  const loadPlans = async () => {
    try {
      const response = await api.getPlans();
      setPlans(response.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadUserPlan = async () => {
    try {
      const response = await api.getUserPlan();
      setUserPlan(response);
    } catch (error) {
      console.error('Failed to load user plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    const plan = plans.find(p => p.id === planId);
    console.log('subbing to plan ', planId)
    // For free plans, subscribe directly
    if (!plan.price || plan.price === 0) {
      setSubscribing(planId);
      try {
        await api.subscribeToPlan({ planId });
        await loadUserPlan(); // Refresh user plan
        alert('Successfully subscribed to plan!');
      } catch (error) {
        console.error('Failed to subscribe:', error);
        alert('Failed to subscribe to plan. Please try again.');
      } finally {
        setSubscribing(null);
      }
      return;
    }

    // For paid plans, show payment modal
    setSelectedPlanForPayment(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlanForPayment) return;

    if (selectedGateway === 'paystack') {
      await handlePaystackPayment(selectedPlanForPayment.id);
    }
    // Stripe payment is handled in the StripeCheckoutForm component
  };

  const handlePaystackPayment = async (planId) => {
    try {
      // Get user email from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const response = await api.subscribeToPlan({
        planId,
        paymentGateway: 'paystack',
        email: currentUser.email
      });

      if (response.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = response.authorizationUrl;
      }
    } catch (error) {
      console.error('Paystack payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    await loadUserPlan();
    setShowPaymentModal(false);
    setSelectedPlanForPayment(null);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 5000); // Hide success message after 5 seconds
  };

  const handlePaystackCallback = async (reference) => {
    try {
      // The backend handles the verification and subscription update
      // We just need to refresh the user plan data
      await loadUserPlan();
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    } catch (error) {
      console.error('Error handling Paystack callback:', error);
      alert('There was an issue processing your payment. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">Select the plan that best fits your social media posting needs</p>

        {/* Payment Success Message */}
        {paymentSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Payment successful! Your plan has been activated.</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Subscribe to {selectedPlanForPayment.name}</h2>
            <p className="text-gray-600 mb-4">
              ${selectedPlanForPayment.price}/month - {selectedPlanForPayment.postsPerWeek} posts per week
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Payment Method
              </label>
              <div className="space-y-2">
                {/* <label className="flex items-center">
                  <input
                    type="radio"
                    value="stripe"
                    checked={selectedGateway === 'stripe'}
                    onChange={(e) => setSelectedGateway(e.target.value)}
                    className="mr-2"
                  />
                  Credit/Debit Card (Stripe)
                </label> */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="paystack"
                    checked={selectedGateway === 'paystack'}
                    onChange={(e) => setSelectedGateway(e.target.value)}
                    className="mr-2"
                  />
                  Paystack (Bank Transfer, Card)
                </label>
              </div>
            </div>

            {selectedGateway === 'paystack' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={subscribing}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {subscribing ? 'Processing...' : 'Continue to Paystack'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {userPlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Current Plan: {userPlan.plan?.name || 'Free Trial'}
              </h2>
              <p className="text-blue-700">
                {userPlan.postsThisWeek} posts this week • {userPlan.remainingPosts} remaining
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">
                {userPlan.postsPerWeek} posts per week
              </p>
              {userPlan.subscribedAt && (
                <p className="text-xs text-blue-500">
                  Subscribed on {new Date(userPlan.subscribedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-lg shadow-sm p-6 ${
              userPlan?.plan?.id === plan.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            }`}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {plan.price ? `$${plan.price}` : 'Free'}
                {plan.price && <span className="text-sm font-normal text-gray-500">/month</span>}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{plan.postsPerWeek} posts per week</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">All social platforms</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">AI content generation</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Automated scheduling</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={userPlan?.plan?.id === plan.id || subscribing === plan.id}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                userPlan?.plan?.id === plan.id
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : subscribing === plan.id
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {userPlan?.plan?.id === plan.id
                ? 'Current Plan'
                : subscribing === plan.id
                ? 'Processing...'
                : plan.price
                ? `Subscribe - $${plan.price}/month`
                : 'Get Started'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;