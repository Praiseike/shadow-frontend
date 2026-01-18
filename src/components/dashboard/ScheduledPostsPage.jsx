import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle,
  Error as ErrorIcon,
  Pending,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import PostComposer from './PostComposer';

const ScheduledPostsPage = () => {
  const navigate = useNavigate();
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [composerOpen, setComposerOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, post: null });
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchScheduledPosts();
  }, [page]);

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getScheduledPosts(null, page, 20);
      setScheduledPosts(data.scheduledPosts || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
      showSnackbar('Failed to load scheduled posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCancelPost = async (postId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) {
      return;
    }

    try {
      await apiService.cancelScheduledPost(postId);
      showSnackbar('Scheduled post cancelled successfully', 'success');
      fetchScheduledPosts();
    } catch (error) {
      console.error('Failed to cancel post:', error);
      showSnackbar('Failed to cancel scheduled post', 'error');
    }
  };

  const handleEditClick = (post) => {
    setEditContent(post.content);
    setEditDialog({ open: true, post });
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) {
      showSnackbar('Content cannot be empty', 'error');
      return;
    }

    try {
      await apiService.updateScheduledPost(editDialog.post.id, {
        content: editContent.trim()
      });
      showSnackbar('Post updated successfully', 'success');
      setEditDialog({ open: false, post: null });
      setEditContent('');
      fetchScheduledPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      showSnackbar('Failed to update post', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'posted':
        return <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} />;
      case 'cancelled':
        return <ErrorIcon sx={{ color: '#718096', fontSize: 20 }} />;
      default:
        return <Pending sx={{ color: '#f59e0b', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'posted':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInIcon sx={{ fontSize: 18 }} />;
      case 'twitter':
        return <TwitterIcon sx={{ fontSize: 18 }} />;
      case 'facebook':
        return <FacebookIcon sx={{ fontSize: 18 }} />;
      default:
        return null;
    }
  };

  if (loading && scheduledPosts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <CircularProgress size={50} />
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
            Scheduled Posts
          </Typography>
          <Typography variant="body1" sx={{ color: '#718096' }}>
            Manage your scheduled posts and queue
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setComposerOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            px: 3,
            py: 1.5
          }}
        >
          New Post
        </Button>
      </Box>

      {/* Posts List */}
      {scheduledPosts.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 64, color: '#cbd5e0', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#2d3748', mb: 1 }}>
              No scheduled posts yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
              Create your first scheduled post to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setComposerOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600
              }}
            >
              Create Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {scheduledPosts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                      {getStatusIcon(post.status)}
                      <Chip
                        label={post.status}
                        size="small"
                        color={getStatusColor(post.status)}
                        sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                      />
                      <Typography variant="caption" sx={{ color: '#718096' }}>
                        Scheduled for {new Date(post.scheduledAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {post.status === 'scheduled' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(post)}
                          sx={{ color: '#667eea' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleCancelPost(post.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body1" sx={{ color: '#2d3748', mb: 2, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </Typography>

                  {/* Platforms */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {post.platforms?.map((platform) => (
                      <Chip
                        key={platform.platform}
                        icon={getPlatformIcon(platform.platform)}
                        label={platform.platform}
                        size="small"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>

                  {post.error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {post.error}
                    </Alert>
                  )}

                  {post.postedAt && (
                    <Typography variant="caption" sx={{ color: '#718096', display: 'block', mt: 1 }}>
                      Posted on {new Date(post.postedAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Post Composer Modal */}
      {composerOpen && (
        <Dialog
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Create Scheduled Post
              </Typography>
              <IconButton onClick={() => setComposerOpen(false)} size="small">
                ×
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <PostComposer
              onSuccess={() => {
                setComposerOpen(false);
                fetchScheduledPosts();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, post: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Post Content</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Post Content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setEditDialog({ open: false, post: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ScheduledPostsPage;

