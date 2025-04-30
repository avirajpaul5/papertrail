import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import type { Newsletter } from '../types/newsletter';
import { getNewsletters, createNewsletter, updateNewsletter, deleteNewsletter } from '../data/newsletterService';

const ADMIN_EMAILS = ['your.email@example.com']; // Replace with your email

function Admin() {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Newsletter>>({
    name: '',
    description: '',
    author_name: '',
    image_url: '',
    website_url: '',
    categories: [],
    tags: [],
    subscriber_count: 0,
    frequency: 'Weekly'
  });
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  useEffect(() => {
    fetchNewsletters();
  }, []);

  async function fetchNewsletters() {
    setIsLoading(true);
    try {
      const data = await getNewsletters();
      setNewsletters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch newsletters');
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'categories' || name === 'tags') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()),
      }));
    } else if (name === 'subscriber_count') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await updateNewsletter(editingId, formData);
      } else {
        await createNewsletter(formData as Omit<Newsletter, 'id' | 'created_at' | 'updated_at'>);
      }

      setFormData({
        name: '',
        description: '',
        author_name: '',
        image_url: '',
        website_url: '',
        categories: [],
        tags: [],
        subscriber_count: 0,
        frequency: 'Weekly'
      });
      setEditingId(null);
      fetchNewsletters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save newsletter');
    }
  };

  const handleEdit = (newsletter: Newsletter) => {
    setEditingId(newsletter.id);
    setFormData(newsletter);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNewsletters();
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete newsletter');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-wide py-8">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Newsletter Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-medium mb-4">
          {editingId ? 'Edit Newsletter' : 'Add New Newsletter'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Name
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories (comma-separated)
            </label>
            <input
              type="text"
              name="categories"
              value={formData.categories?.join(', ')}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags?.join(', ')}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              icon={editingId ? <Save size={16} /> : <Plus size={16} />}
            >
              {editingId ? 'Update Newsletter' : 'Add Newsletter'}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    description: '',
                    author_name: '',
                    image_url: '',
                    website_url: '',
                    categories: [],
                    tags: [],
                  });
                }}
                icon={<X size={16} />}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Newsletters List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium">All Newsletters</h2>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : newsletters.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No newsletters found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {newsletters.map(newsletter => (
              <div key={newsletter.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {newsletter.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {newsletter.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {newsletter.categories.map(category => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(newsletter)}
                    icon={<Pencil size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(newsletter.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
