import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIRecommendationWidget() {
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const handleAskAI = () => {
        if (!query.trim()) return;
        setIsThinking(true);
        setRecommendation(null);

        // Mock AI delay
        setTimeout(() => {
            setIsThinking(false);
            setRecommendation(
                "Based on your interest in " + query + ", I recommend visiting Kyoto in autumn. The weather is perfect for walking, and the foliage is breathtaking. You can find great ryokans in the Gion district for around $150/night."
            );
        }, 2000);
    };

    return (
        <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="border-primary/20 bg-gradient-to-b from-background to-primary/5 overflow-hidden">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Ask Aether AI</CardTitle>
                            <p className="text-muted-foreground">
                                Tell us what you love, and we'll design your perfect trip.
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex gap-2 mb-6">
                                <Input
                                    placeholder="e.g., I want a relaxing beach trip with good food..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                                    className="flex-1"
                                />
                                <Button onClick={handleAskAI} disabled={isThinking || !query.trim()}>
                                    {isThinking ? (
                                        <span className="animate-pulse">Thinking...</span>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" /> Ask
                                        </>
                                    )}
                                </Button>
                            </div>

                            <AnimatePresence>
                                {recommendation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-background border border-border rounded-lg p-4 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm leading-relaxed">{recommendation}</p>
                                                <Button variant="link" className="px-0 h-auto mt-2 text-primary">
                                                    View full itinerary
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
