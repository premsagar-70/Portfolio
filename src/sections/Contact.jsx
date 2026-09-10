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
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            await trackFormSubmission(formData);

            setStatus("success");
            formRef.current.reset();
        } catch (error) {
            console.error("Error sending message:", error.text || error);
            setStatus("error");
        }

        setTimeout(() => setStatus("idle"), 5000);
    };

    return (
        <SectionWrapper id="contact">
            <div className="text-center mb-16">
                <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Contact</p>
                <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">Let's Work Together</h2>
                <p className="text-tx-muted max-w-xl mx-auto">
                    Whether you have a project idea, a collaboration proposal, or just want to say hello — I'd love to hear from you. I'm always open to exploring new opportunities.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 bg-surface border border-bd/40 rounded-2xl hover:border-accent/30 transition-colors">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-tx-main mb-1">Email</h4>
                            <a href="mailto:contact@premsagarr.me" className="text-tx-muted hover:text-accent transition-colors text-sm">contact@premsagarr.me</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-surface border border-bd/40 rounded-2xl hover:border-accent/30 transition-colors">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-tx-main mb-1">Phone</h4>
                            <a href="tel:+917207105206" className="text-tx-muted hover:text-accent transition-colors text-sm">+91 7207105206</a>
                        </div>
                    </div>

                    {/* 
                        ── NOTE: Location card is available. Uncomment and fill in your city/country. ──
                        <div className="flex items-start gap-4 p-5 bg-surface border border-bd/40 rounded-2xl hover:border-accent/30 transition-colors">
                            <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-tx-main mb-1">Location</h4>
                                <p className="text-tx-muted text-sm">City, Country</p>
                            </div>
                        </div>
                    */}
                </div>

                {/* Form */}
                <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-tx-main mb-2">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            name="name"
                            required
                            placeholder="Your name"
                            className="w-full bg-surface border border-bd/50 rounded-xl px-4 py-3 text-tx-main placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-tx-main mb-2">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            name="email"
                            required
                            placeholder="your@email.com"
                            className="w-full bg-surface border border-bd/50 rounded-xl px-4 py-3 text-tx-main placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-tx-main mb-2">Message</label>
                        <textarea
                            id="contact-message"
                            rows="5"
                            name="message"
                            required
                            placeholder="Tell me about your project..."
                            className="w-full bg-surface border border-bd/50 rounded-xl px-4 py-3 text-tx-main placeholder:text-tx-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-y"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`w-full font-semibold py-3.5 rounded-xl transition-all shadow-lg ${
                            status === "loading"
                                ? "bg-accent/50 cursor-not-allowed text-white/70"
                                : "bg-accent hover:bg-accent-hover text-white shadow-accent/20 hover:shadow-accent/30 active:scale-[0.98]"
                        }`}
                    >
                        {status === "loading" ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                Sending...
                            </span>
                        ) : "Send Message"}
                    </button>

                    {status === "success" && (
                        <div className="flex items-center gap-2 justify-center text-emerald-500 text-sm font-medium bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Message sent successfully!
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-2 justify-center text-red-500 text-sm font-medium bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            Failed to send message. Please try again.
                        </div>
                    )}
                </form>
            </div>
        </SectionWrapper>
    );
};

export default Contact;
