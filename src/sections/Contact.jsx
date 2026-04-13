import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import SectionWrapper from "../components/SectionWrapper";
import useAnalytics from "../hooks/useAnalytics";

const Contact = () => {
    const formRef = useRef();
    const [status, setStatus] = useState("idle");
    const { trackFormSubmission } = useAnalytics();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        const formData = {
            name: formRef.current.name.value,
            email: formRef.current.email.value,
            message: formRef.current.message.value,
        };

        try {
            // 1. Send Email via EmailJS
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            // 2. Save to Firestore for Analytics and Admin Dashboard
            await trackFormSubmission(formData);

            setStatus("success");
            formRef.current.reset(); // Clear the form fields
        } catch (error) {
            console.error("Error sending message:", error.text || error);
            setStatus("error");
        }

        // Reset status message after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
    };

    return (
        <SectionWrapper id="contact">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">Get In Touch</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-8"></div>
                <p className="text-tx-muted max-w-xl mx-auto">
                    Have a project in mind or want to collaborate? Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-surface shadow-md border border-bd/30 rounded-lg text-accent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">Email</h4>
                            <a href="mailto:contact@premsagarr.me" className="text-tx-muted hover:text-accent transition-colors">contact@premsagarr.me</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-surface shadow-md border border-bd/30 rounded-lg text-accent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">Phone</h4>
                            <a href="tel:+917207105206" className="text-tx-muted hover:text-accent transition-colors">+91 7207105206</a>
                        </div>
                    </div>
                    {/* 
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-surface/20 rounded-lg text-accent">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">Location</h4>
                            <p className="text-tx-muted">City, Country</p>
                        </div>
                    </div> */}
                </div>

                <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                            className="w-full bg-surface border border-bd/50 rounded-lg px-4 py-3 text-tx-main focus:outline-none focus:border-accent transition-colors shadow-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email"
                            className="w-full bg-surface border border-bd/50 rounded-lg px-4 py-3 text-tx-main focus:outline-none focus:border-accent transition-colors shadow-sm"
                        />
                    </div>
                    <div>
                        <textarea
                            rows="4"
                            name="message"
                            required
                            placeholder="Your Message"
                            className="w-full bg-surface border border-bd/50 rounded-lg px-4 py-3 text-tx-main focus:outline-none focus:border-accent transition-colors shadow-sm"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg ${status === "loading" ? "bg-accent/50 cursor-not-allowed" : "bg-accent hover:bg-accent-hover hover:shadow-accent/25"
                            } text-tx-main`}
                    >
                        {status === "loading" ? "Sending..." : "Send Message"}
                    </button>
                    {status === "success" && (
                        <p className="text-green-500 text-center text-sm font-medium mt-4">Message sent successfully!</p>
                    )}
                    {status === "error" && (
                        <p className="text-red-500 text-center text-sm font-medium mt-4">Failed to send message. Please try again.</p>
                    )}
                </form>
            </div>
        </SectionWrapper>
    );
};

export default Contact;
