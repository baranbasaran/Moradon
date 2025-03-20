import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaComments,
  FaShieldAlt,
  FaRocket,
  FaCheckCircle,
  FaQuestionCircle,
} from "react-icons/fa";

const WelcomePage: React.FC = () => {
  const features = [
    {
      icon: <FaUsers className="h-8 w-8 text-primary" />,
      title: "Connect with Your Community",
      description:
        "Join a vibrant community of like-minded individuals and share your experiences.",
    },
    {
      icon: <FaComments className="h-8 w-8 text-primary" />,
      title: "Engage in Meaningful Discussions",
      description:
        "Start conversations, share ideas, and learn from others in your community.",
    },
    {
      icon: <FaShieldAlt className="h-8 w-8 text-primary" />,
      title: "Secure and Private",
      description:
        "Your privacy is our priority. Share what you want, when you want.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description:
        "Sign up in minutes and customize your profile to reflect who you are.",
    },
    {
      step: "2",
      title: "Join Communities",
      description:
        "Find and join communities that match your interests and values.",
    },
    {
      step: "3",
      title: "Start Sharing",
      description: "Share your thoughts, experiences, and connect with others.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Moradon has transformed how I connect with my community. It's amazing!",
      author: "Sarah Johnson",
      role: "Community Leader",
    },
    {
      quote:
        "The best platform for meaningful discussions and genuine connections.",
      author: "Michael Chen",
      role: "Active Member",
    },
  ];

  const faqs = [
    {
      question: "What is Moradon?",
      answer:
        "Moradon is a community platform that helps people connect, share, and engage with like-minded individuals in a safe and supportive environment.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply create an account, complete your profile, and start exploring communities that interest you. You can begin posting and engaging with others right away.",
    },
    {
      question: "Is my privacy protected?",
      answer:
        "Yes, we take privacy seriously. You have full control over what you share and who can see your content.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Moradon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with your community, share experiences, and engage in
            meaningful discussions.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/auth/signup"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/auth/login"
              className="bg-white dark:bg-gray-800 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Moradon?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.author[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              >
                <div className="flex items-start">
                  <FaQuestionCircle className="h-6 w-6 text-primary mt-1 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Create your account today and start connecting with amazing people
            who share your interests.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaRocket className="mr-2" />
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
