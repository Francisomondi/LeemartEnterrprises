import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import axiosInstance from "../lib/axios";
import axios from "axios";





const ProfilePage = () => {
  const { user, fetchProfile, updateProfile, loading , updateAvatar} = useUserStore();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
      });
      fetchOrders();
      fetchTransactions();
    }
  }, [user]);

  

  // Normalize phone for MPESA
  const normalizePhone = (phone) => {
    let p = phone.trim();
    if (/^0(7|1)\d{8}$/.test(p)) {
      p = "254" + p.slice(1);
    }
    return p;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(form.phone);

    if (!/^254(7|1)\d{8}$/.test(normalizedPhone)) {
      toast.error("Invalid Safaricom phone number");
      return;
    }

    try {
      await updateProfile({ name: form.name, phone: normalizedPhone });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setAvatarLoading(true);

  try {
    await updateAvatar(file);
    await fetchProfile();

    toast.success("Avatar updated successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to upload avatar.");
  } finally {
    setAvatarLoading(false);
  }
};

 const fetchOrders = async () => {
  try {
    const res = await axiosInstance.get(
      "/orders/my-orders",
      {
        withCredentials: true,
      }
    );

    //console.log(res.data.orders);

    // ONLY SUCCESSFUL / PAID ORDERS
    const successfulOrders =
      res.data.orders.filter(
        (order) =>
          order.paymentStatus === "paid" ||
          order.isPaid === true ||
          order.status === "success"
      );

    setOrders(successfulOrders);

  } catch (error) {

    console.error(
      "Failed to fetch orders:",
      error
    );
  }
};

const fetchTransactions = async () => {
  try {
    const res = await axiosInstance.get("/mpesa/my", {
    withCredentials: true,
  });
 setTransactions(res.data.transactions);
  } catch (error) {
        console.error("Failed to fetch MPESA transactions:", error);
      }
};

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">My Profile</h1>

      {/* User Info & Avatar */}
      <div className="bg-gray-900 shadow rounded-lg p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center">

  <div className="relative group">

    <img
      src={user.avatar || "/default-avatar.png"}
      alt={user.name}
      className="
        w-36
        h-36
        rounded-full
        object-cover
        border-4
        border-emerald-500
        shadow-lg
      "
    />

    <label
      className="
        absolute
        bottom-1
        right-1
        bg-emerald-600
        hover:bg-emerald-700
        w-10
        h-10
        rounded-full
        flex
        items-center
        justify-center
        cursor-pointer
        shadow-lg
        transition
      "
    >
      {avatarLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity=".25"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536M16 3l5 5M4 20l4.586-1.146a2 2 0 00.949-.535L19 9a2.828 2.828 0 10-4-4l-9.535 9.535a2 2 0 00-.535.949L4 20z"
          />
        </svg>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </label>
  </div>

  <h3 className="mt-4 text-lg font-semibold text-white">
    {user.name}
  </h3>

  <p className="text-sm text-gray-400">
    {user.email}
  </p>

  <label
    className="
      mt-4
      px-5
      py-2
      rounded-lg
      bg-emerald-600
      hover:bg-emerald-700
      text-white
      cursor-pointer
      transition
      text-sm
      font-medium
    "
  >
    {avatarLoading ? "Uploading..." : "Choose New Avatar"}

    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="hidden"
    />
  </label>

</div>

        <div className="flex-1 grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400">Full Name</p>
            <p className="text-white font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="text-white font-semibold">{user.phone || "Not set"}</p>
          </div>
          <div>
            <p className="text-gray-400">Registered On</p>
            <p className="text-white font-semibold">
              {user.createdAt
                ? format(new Date(user.createdAt), "PPP")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-gray-900 shadow rounded-lg p-6 md:p-10">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 py-3 rounded text-white font-semibold hover:bg-emerald-700 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Recent Orders */}
  <div className="bg-gray-900 shadow rounded-2xl p-6 md:p-10 border border-gray-800">
	
    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-emerald-400">
          Recent Orders
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Your latest purchases
        </p>
      </div>

      {orders.length > 0 && (
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition">
          View All
        </button>
      )}
    </div>

	{/* EMPTY STATE */}
	{orders.length === 0 ? (

		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
				📦
			</div>

			<p className="text-gray-300 font-medium">
				No orders yet
			</p>

			<p className="text-gray-500 text-sm mt-1">
				Your recent purchases will appear here.
			</p>
		</div>

	) : (

		<div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">

			{orders.slice(0, 5).map((order) => (

				<div
					key={order._id}
					className="bg-gray-800/70 border border-gray-700 hover:border-emerald-500/40 transition rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
				>

					{/* LEFT */}
					<div className="space-y-1">
						<p className="font-semibold text-white">
							Order #{order._id}
						</p>

						<p className="text-sm text-gray-400">
							{format(
								new Date(order.createdAt),
								"PPP"
							)}
						</p>
					</div>

					{/* CENTER */}
					<div className="flex items-center gap-3">

						<span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							Paid
						</span>
            <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							{user.phone}
						</span>

						<p className="text-lg font-bold text-emerald-400">
							KES {order.totalAmount}
						</p>
					</div>

				</div>
			))}
		</div>
	)}
  </div>

      {/* Recent MPESA Transactions */}
      <div className="bg-gray-900 shadow rounded-lg p-6 md:p-10">
      <h2 className="text-xl font-bold text-emerald-400 mb-4">My MPESA Payments</h2>

      {transactions?.length === 0 ? (
        <p className="text-gray-400" >No MPESA transactions found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-2">Receipt</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions?.map(tx => (
              <tr key={tx._id} className="border-t">
                <td className="p-2">{tx.mpesaReceiptNumber || "—"}</td>
                <td className="p-2">KES {tx.amount}</td>
                <td className="p-2">{tx.phoneNumber}</td>
                <td className="p-2">
                  <span
                    className={
                      tx.status === "SUCCESS"
                        ? "text-green-600"
                        : tx.status === "FAILED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="p-2">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
</div>
  );
};

export default ProfilePage;
