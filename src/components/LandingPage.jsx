import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  SmartToy as SmartToyIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import Layout from './Layout';

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content: "PostNexus has transformed my LinkedIn presence. I went from posting once a week to consistent daily engagement with my audience.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The AI-generated content is incredibly relevant to my field. It's like having a personal content strategist working 24/7.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer",
      company: "CloudTech",
      content: "Scheduling posts twice a day has increased my professional network by 300% in just 3 months. Game changer!",
      avatar: "ER"
    }
  ];

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 56 }} />,
      title: "AI-Powered Content",
      description: "Advanced GPT-4 technology generates personalized, engaging content based on your expertise and selected topics.",
      benefits: ["Context-aware writing", "Industry-specific insights", "Engagement-optimized posts"],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 56 }} />,
      title: "Multi-Platform Automation",
      description: "Connect LinkedIn, Twitter, and Facebook accounts for seamless cross-platform content distribution.",
      benefits: ["Unified scheduling", "Platform-optimized formatting", "Performance analytics"],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 56 }} />,
      title: "Smart Scheduling",
      description: "Post twice daily at optimal times based on your audience's engagement patterns and time zones.",
      benefits: ["Peak engagement timing", "Automated posting", "Flexible scheduling"],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individual developers",
      features: [
        "1 Social Account",
        "AI Content Generation",
        "Basic Scheduling",
        "Content Analytics",
        "Email Support"
      ],
      popular: false,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing professionals",
      features: [
        "3 Social Accounts",
        "Advanced AI Content",
        "Custom Scheduling",
        "Detailed Analytics",
        "Priority Support",
        "Custom Topics"
      ],
      popular: true,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For teams and organizations",
      features: [
        "Unlimited Accounts",
        "Premium AI Features",
        "Team Collaboration",
        "Advanced Analytics",
        "24/7 Support",
        "API Access"
      ],
      popular: false,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ];

  const faqs = [
    {
      question: "How does the AI content generation work?",
      answer: "Our AI analyzes your profile, selected topics, and industry trends to create personalized, engaging content that resonates with your audience. Each post is crafted to sound like you while incorporating current best practices."
    },
    {
      question: "Can I customize the posting schedule?",
      answer: "Absolutely! You can set two posting times per day, choose which platforms to post on, and even specify different content topics for different times. The system learns from your audience's engagement patterns."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, security is our top priority. All data is encrypted, we use secure OAuth connections for social media platforms, and we never store your social media passwords. Your content and personal information are protected with enterprise-grade security."
    },
    {
      question: "What platforms are supported?",
      answer: "Currently, we fully support LinkedIn with Twitter and Facebook integration coming soon. Each platform gets content optimized for its unique audience and formatting requirements."
    },
    {
      question: "Can I edit the AI-generated content?",
      answer: "Yes! You can review, edit, and save drafts of AI-generated content before publishing. The AI provides a great starting point, but you have full control over the final content."
    }
  ];

  return (
    <Layout>

      {/* Hero Section */}
      <section>
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip 
                label="🚀 Now with GPT-4 Turbo" 
                sx={{ 
                  mb: 3,
                  background: 'rgba(102, 126, 234, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600
                }} 
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #ffffff 0%, #a8b5ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-2px'
                }}
              >
                AI-Powered Social Media on Autopilot
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                mb: 5, 
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}>
                Connect once. Let AI create engaging content. Watch your network grow while you sleep.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 6 }}>
                <Link to="/auth">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<BoltIcon />}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                      textTransform: 'none',
                      '&:hover': {
                        boxShadow: '0 16px 56px rgba(102, 126, 234, 0.7)',
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    px: 5, 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  See How It Works
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                    4.9/5 from 10,000+ users
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['💼', '🚀', '🎯'].map((emoji, i) => (
                    <Box key={i} sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 2, 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {emoji}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'transform 0.6s',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)'
                  }
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}>
                  <Box sx={{ 
                    fontSize: { xs: '4rem', md: '6rem' },
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>
                    🤖
                  </Box>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, textAlign: 'center', px: 4 }}>
                    AI Creates.<br/>You Succeed.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {[
                      { icon: '📈', label: '+300%' },
                      { icon: '⚡', label: '2x Daily' },
                      { icon: '🎯', label: '100% Auto' }
                    ].map((stat, i) => (
                      <Box key={i} sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        px: 3,
                        py: 2,
                        textAlign: 'center'
                      }}>
                        <Box sx={{ fontSize: '2rem', mb: 1 }}>{stat.icon}</Box>
                        <Typography sx={{ color: 'white', fontWeight: 700 }}>{stat.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip 
              label="Features" 
              sx={{ 
                mb: 3,
                background: 'rgba(102, 126, 234, 0.2)',
                color: 'white',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }} 
            />
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              color: 'white', 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-1px'
            }}>
              Everything You Need to Dominate
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              maxWidth: 700, 
              mx: 'auto',
              lineHeight: 1.8
            }}>
              Powerful AI meets seamless automation. Your social media presence, reimagined.
            </Typography>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" spacing={4}>
            {features.map((feature, index) => (
              <Grid xs={12} md={4} key={index}>
                <Card
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    background: hoveredCard === index 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 5,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: hoveredCard === index ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredCard === index 
                      ? '0 24px 60px rgba(102, 126, 234, 0.3)' 
                      : '0 8px 24px rgba(0, 0, 0, 0.2)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.gradient,
                      opacity: hoveredCard === index ? 1 : 0,
                      transition: 'opacity 0.3s'
                    }
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ 
                      mb: 3,
                      width: 80,
                      height: 80,
                      borderRadius: 4,
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                    <Box>
                      {feature.benefits.map((benefit, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <CheckCircleIcon sx={{ color: '#10b981', mr: 1.5, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                            {benefit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip 
              label="Success Stories" 
              sx={{ 
                mb: 3,
                background: 'rgba(240, 147, 251, 0.2)',
                color: 'white',
                border: '1px solid rgba(240, 147, 251, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }} 
            />
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              color: 'white', 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-1px'
            }}>
              Loved by Thousands
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Real people, real results, real growth
            </Typography>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 5,
                  p: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 48px rgba(240, 147, 251, 0.2)',
                    border: '1px solid rgba(240, 147, 251, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', mb: 3 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      mb: 4, 
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      fontSize: '1.05rem'
                    }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 56, 
                        height: 56,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 700,
                        fontSize: '1.2rem'
                      }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {testimonial.role} at {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip 
              label="Pricing" 
              sx={{ 
                mb: 3,
                background: 'rgba(79, 172, 254, 0.2)',
                color: 'white',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }} 
            />
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              color: 'white', 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-1px'
            }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Choose the perfect plan for your growth journey
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    background: plan.popular 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: plan.popular 
                      ? '2px solid rgba(102, 126, 234, 0.5)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 5,
                    transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.4s',
                    '&:hover': {
                      transform: plan.popular ? 'scale(1.07)' : 'scale(1.02)',
                      boxShadow: '0 24px 60px rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  {plan.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      height: '6px',
                      background: plan.gradient,
                      borderRadius: '5px 5px 0 0'
                    }} />
                  )}
                  {plan.popular && (
                    <Chip
                      label="⚡ Most Popular"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 5 }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: 'white', 
                      mb: 2,
                      mt: plan.popular ? 3 : 0
                    }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                      <Typography variant="h2" sx={{ 
                        fontWeight: 900, 
                        background: plan.gradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)', ml: 1 }}>
                        {plan.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      mb: 4,
                      fontSize: '1rem'
                    }}>
                      {plan.description}
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          padding: '8px 0'
                        }}>
                          <CheckCircleIcon sx={{ 
                            color: '#10b981', 
                            mr: 2, 
                            fontSize: 22 
                          }} />
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1rem',
                            fontWeight: 500
                          }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ 
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        background: plan.popular 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: plan.popular 
                          ? '0 8px 24px rgba(102, 126, 234, 0.4)' 
                          : 'none',
                        '&:hover': {
                          background: plan.popular 
                            ? 'linear-gradient(135deg, #5a5fd6 0%, #6a4191 100%)'
                            : 'rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      {plan.name === 'Starter' ? 'Start Free Trial' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip 
              label="FAQ" 
              sx={{ 
                mb: 3,
                background: 'rgba(250, 112, 154, 0.2)',
                color: 'white',
                border: '1px solid rgba(250, 112, 154, 0.3)',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }} 
            />
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              color: 'white', 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-1px'
            }}>
              Got Questions?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              We've got answers to everything you need to know
            </Typography>
          </Box>

          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px !important',
                overflow: 'hidden',
                '&:before': { display: 'none' },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                },
                transition: 'all 0.3s'
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                sx={{ py: 2 }}
              >
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '1.1rem'
                }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.8,
                  fontSize: '1rem'
                }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="md">
          <Box sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 6,
            p: { xs: 6, md: 10 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(102, 126, 234, 0.4)'
          }}>
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(60px)'
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(40px)'
            }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{ 
                color: 'white', 
                fontWeight: 900, 
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: '-1px'
              }}>
                Ready to 10x Your Social Presence?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 5,
                lineHeight: 1.8,
                fontSize: '1.2rem'
              }}>
                Join 10,000+ professionals already growing on autopilot
              </Typography>
              <Link to="/auth">
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 8,
                    py: 3,
                    backgroundColor: 'white',
                    color: '#667eea',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    borderRadius: 4,
                    textTransform: 'none',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Start Free Trial Now
                </Button>
              </Link>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mt: 3,
                fontSize: '1rem'
              }}>
                ✓ No credit card required  •  ✓ 14-day free trial  •  ✓ Cancel anytime
              </Typography>
            </Box>
          </Box>
        </Container>
      </section>

    </Layout>
  );
};

export default LandingPage;