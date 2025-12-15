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
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Trusted automation for modern professionals"
                sx={{
                  mb: 3,
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(226, 232, 240, 0.2)',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.75rem', md: '3.75rem' },
                  lineHeight: 1.05,
                  color: '#e2e8f0',
                  letterSpacing: '-1px'
                }}
              >
                Automate your social growth with confident, on-brand AI.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(226, 232, 240, 0.8)',
                  mb: 4,
                  lineHeight: 1.7,
                  maxWidth: 720
                }}
              >
                Connect LinkedIn and Twitter once. We plan, write, and schedule for you—so you can focus on work while your audience and pipeline grow.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                <Link to="/auth">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<BoltIcon />}
                    sx={{
                      px: 4,
                      py: 1.75,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 3
                    }}
                  >
                    Start free trial
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  sx={{
                    px: 4,
                    py: 1.65,
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 3,
                    color: '#e2e8f0',
                    borderColor: 'rgba(226, 232, 240, 0.25)',
                    '&:hover': {
                      borderColor: 'rgba(226, 232, 240, 0.5)',
                      backgroundColor: 'rgba(226, 232, 240, 0.04)'
                    }
                  }}
                >
                  See how it works
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                    4.9/5 from 10,000+ users
                  </Typography>
                </Box>
                <Chip
                  icon={<CheckCircleIcon sx={{ color: '#22c55e' }} />}
                  label="Secure OAuth, no passwords stored"
                  sx={{
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    color: '#a7f3d0',
                    borderRadius: 2,
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'linear-gradient(145deg, #0b1220, #111827)',
                  border: '1px solid rgba(226, 232, 240, 0.08)',
                  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
                  p: 3
                }}
              >
                <CardContent sx={{ p: { xs: 1, md: 2 } }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>
                    Weekly plan preview
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(226, 232, 240, 0.04)',
                      border: '1px solid rgba(226, 232, 240, 0.06)',
                      p: 2,
                      mb: 3
                    }}
                  >
                    {[['Mon', 'LinkedIn • 9:00'], ['Wed', 'Twitter • 15:00'], ['Fri', 'LinkedIn • 10:00']].map(
                      ([day, slot], idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1.25,
                            borderBottom: idx < 2 ? '1px solid rgba(148, 163, 184, 0.18)' : 'none'
                          }}
                        >
                          <Typography sx={{ color: '#e2e8f0', fontWeight: 700 }}>{day}</Typography>
                          <Typography sx={{ color: '#cbd5e1', fontWeight: 500 }}>{slot}</Typography>
                        </Box>
                      )
                    )}
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {[
                      { icon: <TrendingUpIcon />, label: 'Engagement', value: '+212%' },
                      { icon: <PeopleIcon />, label: 'Connections', value: '+3.2k' },
                      { icon: <ScheduleIcon />, label: 'Posts automated', value: '14/wk' }
                    ].map((item, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Card
                          sx={{
                            background: 'rgba(226, 232, 240, 0.03)',
                            border: '1px solid rgba(226, 232, 240, 0.06)',
                            borderRadius: 3,
                            p: 2,
                            textAlign: 'center'
                          }}
                        >
                          <Box sx={{ color: '#a5b4fc', display: 'flex', justifyContent: 'center', mb: 1 }}>
                            {item.icon}
                          </Box>
                          <Typography sx={{ color: '#e2e8f0', fontWeight: 700 }}>{item.value}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {item.label}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#312e81' }}>AI</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 700 }}>
                        Live AI drafting
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Tailored to your topics and tone
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Why teams choose us"
              sx={{
                mb: 2,
                background: 'rgba(148, 163, 184, 0.12)',
                color: '#cbd5e1',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                textTransform: 'none',
                fontWeight: 600
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#e2e8f0',
                mb: 2,
                fontSize: { xs: '2.25rem', md: '3rem' }
              }}
            >
              Built for consistent, on-brand publishing
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(226, 232, 240, 0.7)',
                maxWidth: 760,
                mx: 'auto',
                lineHeight: 1.7
              }}
            >
              AI drafting, scheduling, and analytics in one place—without the noisy UI.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    background: hoveredCard === index ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(226, 232, 240, 0.12)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredCard === index
                      ? '0 18px 48px rgba(0, 0, 0, 0.28)'
                      : '0 10px 32px rgba(0, 0, 0, 0.18)',
                    transform: hoveredCard === index ? 'translateY(-6px)' : 'translateY(0)'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: feature.gradient,
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        mb: 2.5
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(226, 232, 240, 0.72)', mb: 2, lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      {feature.benefits.map((benefit, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.85)', fontWeight: 500 }}>
                            {benefit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
                    <Link to={plan.name === 'Starter' ? '/auth' : '/user/plans'} style={{ textDecoration: 'none' }}>
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
                    </Link>
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