import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";

const ProfilePage = () => {
  const { user, fetchProfile, updateProfile, loading } =
    useUserStore();

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

 useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h2 className="text-2xl font-bold mb-6">
        My Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-3 bg-gray-800 rounded"
        />

        <input
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="2547XXXXXXXX"
        />

        <button
          disabled={loading}
          className="w-full bg-emerald-600 py-3 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
