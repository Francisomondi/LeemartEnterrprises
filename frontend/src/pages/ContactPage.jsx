import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

import { useRef, useState } from "react";

const ContactPage = () => {
	const formRef = useRef();
	

	

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

				<div className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<Mail className="mx-auto text-emerald-400 mb-3" />
						<p>support@leemart.co.ke</p>
					</div>

					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<Phone className="mx-auto text-emerald-400 mb-3" />
						<p>+254 740694770</p>
					</div>

					<div className="bg-gray-900 p-6 rounded-xl text-center">
						<MapPin className="mx-auto text-emerald-400 mb-3" />
						<p>Nairobi, Kenya</p>
					</div>
				</div>

				<div className="bg-gray-900 p-8 rounded-xl max-w-3xl mx-auto">
					<h3 className="text-xl font-semibold text-white mb-6 text-center">
						Send Us a Message
					</h3>

					<form ref={formRef}  className="space-y-4">
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
							className="w-full bg-emerald-500 py-3 rounded-md text-white font-semibold hover:bg-emerald-600"
						>
							{loading ? "Sending..." : "Send Message"}
						</button>

						{message && (
							<p className="text-center mt-4 text-sm text-emerald-400">
								{message}
							</p>
						)}
					</form>
				</div>

			</div>
		</div>
	);
};

export default ContactPage;
