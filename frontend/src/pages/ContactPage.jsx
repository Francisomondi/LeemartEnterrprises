import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

const WHATSAPP_NUMBER = "254740694770";
const WHATSAPP_MESSAGE = "Hello Leemart, I need help with my order.";

const ContactPage = () => {
	const formRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");

	const sendEmail = (e) => {
		e.preventDefault();
		setLoading(true);
		setStatus("");

		emailjs
			.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				formRef.current,
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY
			)
			.then(
				() => {
					setStatus("✅ Message sent successfully. We’ll get back to you shortly.");
					formRef.current.reset();
					setLoading(false);
				},
				(error) => {
					console.error("EmailJS Error:", error);
					setStatus("❌ Failed to send message. Please try again.");
					setLoading(false);
				}
			);
	};

	return (
		<div className="min-h-screen bg-gray-950 text-gray-300">
			<div className="max-w-5xl mx-auto px-4 py-16">

				<motion.h1
					className="text-4xl font-bold text-emerald-400 text-center mb-12"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					Contact Us
				</motion.h1>

				{/* Contact Info */}
				<div className="grid md:grid-cols-4 gap-8 mb-16">
					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<Mail className="mx-auto text-emerald-400 mb-3" />
						<p>support@leemart.co.ke</p>
					</div>

					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<Phone className="mx-auto text-emerald-400 mb-3" />
						<p>+254 715536285</p>
					</div>

					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<MapPin className="mx-auto text-emerald-400 mb-3" />
						<p>Nairobi, Kenya</p>
					</div>

					{/* WhatsApp */}
					<a
						href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
							WHATSAPP_MESSAGE
						)}`}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-green-600 hover:bg-green-700 p-6 rounded-xl text-center transition"
					>
						<MessageCircle className="mx-auto text-white mb-3" />
						<p className="text-white font-semibold">Chat on WhatsApp</p>
					</a>
				</div>

				{/* Contact Form */}
				<div className="bg-gray-900 p-8 rounded-xl max-w-3xl mx-auto">
					<h3 className="text-xl font-semibold text-white mb-6 text-center">
						Send Us a Message
					</h3>

					<form ref={formRef} onSubmit={sendEmail} className="space-y-4">
						<input
							type="text"
							name="name"
							required
							placeholder="Your Name"
							className="w-full bg-gray-800 px-4 py-3 rounded-md"
						/>

						<input
							type="email"
							name="email"
							required
							placeholder="Your Email"
							className="w-full bg-gray-800 px-4 py-3 rounded-md"
						/>

						<textarea
							name="message"
							required
							rows="4"
							placeholder="Your Message"
							className="w-full bg-gray-800 px-4 py-3 rounded-md"
						/>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-emerald-500 py-3 rounded-md text-white font-semibold hover:bg-emerald-600 disabled:opacity-50"
						>
							{loading ? "Sending..." : "Send Message"}
						</button>

						{status && (
							<p className="text-center mt-4 text-sm text-emerald-400">
								{status}
							</p>
						)}
					</form>
				</div>

			</div>
		</div>
	);
};

export default ContactPage;
