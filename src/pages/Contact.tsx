import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions about your next adventure? Our team is here to help you plan the perfect trip.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-100 h-full">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-xl">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email</p>
                                            <p className="text-gray-900 font-medium">hello@somtravel.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-xl">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Phone</p>
                                            <p className="text-gray-900 font-medium">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-xl">
                                            <MapPin className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Office</p>
                                            <p className="text-gray-900 font-medium">
                                                123 Adventure Lane<br />
                                                San Francisco, CA 94105
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">First Name</label>
                                            <Input placeholder="John" className="bg-gray-50 border-gray-200 focus:bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                                            <Input placeholder="Doe" className="bg-gray-50 border-gray-200 focus:bg-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <Input type="email" placeholder="john@example.com" className="bg-gray-50 border-gray-200 focus:bg-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Message</label>
                                        <Textarea placeholder="Tell us about your dream trip..." className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white resize-none" />
                                    </div>

                                    <Button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-200">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
