import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

/**
 * Example component showing how to use Supabase client
 * This demonstrates fetching data from a Supabase table
 */
function SupabaseExample() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGoats() {
      try {
        setLoading(true);
        
        // Fetch all goats from the 'goats' table
        const { data, error } = await supabase
          .from('goats')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setGoats(data);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching goats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoats();
  }, []);

  if (loading) {
    return <div>Loading goats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Goats from Supabase</h2>
      {goats.length === 0 ? (
        <p>No goats found</p>
      ) : (
        <ul>
          {goats.map((goat) => (
            <li key={goat.goat_id}>
              {goat.tag_number} - {goat.name} ({goat.breed})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupabaseExample;
