import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  People as PeopleIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Topic as TopicIcon,
  Article,
  CheckCircle,
  Error as ErrorIcon,
  Pending,
  BarChart,
  TrendingUp
} from '@mui/icons-material';
import apiService from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Admin dashboard is an open route, no auth required
        const data = await apiService.getDashboardOverview(false);
        setDashboardData(data.overview);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress size={50} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const stats = dashboardData ? [
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers,
      subtitle: 'Registered',
      icon: <PeopleIcon />,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Connected',
      value: dashboardData.stats.totalConnections,
      subtitle: 'Social Accounts',
      icon: <LinkIcon />,
      gradient: 'from-pink-500 to-red-500'
    },
    {
      title: 'Active',
      value: dashboardData.stats.activeSchedules,
      subtitle: 'Schedules',
      icon: <ScheduleIcon />,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Total Topics',
      value: dashboardData.stats.totalTopics,
      subtitle: 'Selected',
      icon: <TopicIcon />,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Generated',
      value: dashboardData.stats.totalGenerated,
      subtitle: 'Posts',
      icon: <Article />,
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Posted',
      value: dashboardData.stats.totalPosted,
      subtitle: 'Posts',
      icon: <CheckCircle />,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'This Week',
      value: dashboardData.stats.postsThisWeek,
      subtitle: 'Posts',
      icon: <BarChart />,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Pending',
      value: dashboardData.stats.totalPending,
      subtitle: 'Posts',
      icon: <Pending />,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Failed',
      value: dashboardData.stats.totalFailed,
      subtitle: 'Posts',
      icon: <ErrorIcon />,
      gradient: 'from-red-500 to-pink-500'
    }
  ] : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#718096' }}>
          Overview of PostNexus platform statistics
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <div className={`bg-gradient-to-br ${stat.gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                {stat.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1">
          {/* Recent Activity */}
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {dashboardData?.recentPosts && dashboardData.recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Chip
                            label={post.platform}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          />
                          <Chip
                            label={post.status}
                            size="small"
                            icon={
                              post.status === 'posted' ? <CheckCircle /> :
                              post.status === 'failed' ? <ErrorIcon /> :
                              <Pending />
                            }
                            color={
                              post.status === 'posted' ? 'success' :
                              post.status === 'failed' ? 'error' :
                              'default'
                            }
                          />
                          <Typography variant="caption" sx={{ color: '#718096' }}>
                            by {post.userName}
                          </Typography>
                        </div>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </div>
                      <Typography variant="body2" sx={{ color: '#2d3748' }}>
                        {post.content}
                      </Typography>
                      {post.error && (
                        <Typography variant="caption" sx={{ color: '#e53e3e', mt: 1, display: 'block' }}>
                          Error: {post.error}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Typography variant="body1" sx={{ color: '#718096' }}>
                    No recent activity
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Performance by Platform */}
          {dashboardData?.postsByPlatform && dashboardData.postsByPlatform.length > 0 && (
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                  Post Performance by Platform
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.postsByPlatform.map((platform) => (
                    <div
                      key={platform.platform}
                      className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {platform.platform === 'linkedin' && <LinkedInIcon sx={{ color: '#0077b5' }} />}
                        {platform.platform === 'twitter' && <TwitterIcon sx={{ color: '#1DA1F2' }} />}
                        {platform.platform === 'facebook' && <FacebookIcon sx={{ color: '#1877F2' }} />}
                        {platform.platform === 'generated' && <Article sx={{ color: '#667eea' }} />}
                        {platform.platform === 'draft' && <Pending sx={{ color: '#718096' }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2d3748', textTransform: 'capitalize' }}>
                          {platform.platform}
                        </Typography>
                      </div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {platform.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Posts
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connections by Platform */}
          {dashboardData?.connectionsByPlatform && dashboardData.connectionsByPlatform.length > 0 && (
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
                  Social Connections by Platform
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.connectionsByPlatform.map((conn) => (
                    <div
                      key={conn.platform}
                      className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {conn.platform === 'linkedin' && <LinkedInIcon sx={{ color: '#0077b5' }} />}
                        {conn.platform === 'twitter' && <TwitterIcon sx={{ color: '#1DA1F2' }} />}
                        {conn.platform === 'facebook' && <FacebookIcon sx={{ color: '#1877F2' }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2d3748', textTransform: 'capitalize' }}>
                          {conn.platform}
                        </Typography>
                      </div>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {conn.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Connections
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary Stats */}
        <div className="w-full lg:w-96">
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: 24
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 3 }}>
                Summary
              </Typography>
              
              {dashboardData?.postsByStatus && dashboardData.postsByStatus.length > 0 && (
                <div className="mb-4">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
                    Posts by Status
                  </Typography>
                  <div className="space-y-2">
                    {dashboardData.postsByStatus.map((status) => (
                      <div key={status.status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          {status.status === 'posted' && <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />}
                          {status.status === 'failed' && <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />}
                          {status.status === 'pending' && <Pending sx={{ color: '#f59e0b', fontSize: 20 }} />}
                          {status.status === 'generated' && <Article sx={{ color: '#667eea', fontSize: 20 }} />}
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#2d3748', textTransform: 'capitalize' }}>
                            {status.status}
                          </Typography>
                        </div>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#667eea' }}>
                          {status.count}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Divider sx={{ my: 3 }} />

              <div>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2d3748', mb: 2 }}>
                  Platform Overview
                </Typography>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
                    <TrendingUp sx={{ color: '#667eea', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#2d3748' }}>
                      Total Posts This Week: <strong>{dashboardData?.stats?.postsThisWeek || 0}</strong>
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                    <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#2d3748' }}>
                      Successfully Posted: <strong>{dashboardData?.stats?.totalPosted || 0}</strong>
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50">
                    <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#2d3748' }}>
                      Failed Posts: <strong>{dashboardData?.stats?.totalFailed || 0}</strong>
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;

