"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMilkProductionTips, type MilkProductionTipsInput } from '@/ai/flows/milk-production-tips';

interface MilkProductionTipsGeneratorProps {
  farmerId: string;
}

export function MilkProductionTipsGenerator({ farmerId }: MilkProductionTipsGeneratorProps) {
  const [previousMilkTests, setPreviousMilkTests] = useState('');
  const [localAgriculturalData, setLocalAgriculturalData] = useState('');
  const [generatedTips, setGeneratedTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultPreviousMilkTests = JSON.stringify({
    "somatic_cell_count": "200000 cells/mL",
    "butterfat_content": "3.8%",
    "protein_content": "3.2%",
    "last_month_yield_liters": 600
  }, null, 2);

  const defaultLocalAgriculturalData = JSON.stringify({
    "region": "South Western Uganda",
    "avg_rainfall_mm": "1200-1500 annually",
    "common_feed_supplements": ["Maize bran", "Cottonseed cake", "Calliandra"],
    "dominant_grass_type": "Napier grass",
    "common_diseases": ["East Coast Fever", "Mastitis"]
  }, null, 2);


  const handleSubmit = async () => {
    if (!previousMilkTests.trim() || !localAgriculturalData.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please provide both previous milk test data and local agricultural data.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedTips(null);

    try {
      const input: MilkProductionTipsInput = {
        farmerId,
        previousMilkTests,
        localAgriculturalData,
      };
      const result = await generateMilkProductionTips(input);
      setGeneratedTips(result.tips);
      toast({
        title: 'Tips Generated!',
        description: 'Personalized milk production tips are ready.',
      });
    } catch (error) {
      console.error('Error generating tips:', error);
      toast({
        title: 'Error Generating Tips',
        description: 'Could not generate tips. Please try again. ' + (error instanceof Error ? error.message : String(error)),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI-Powered Milk Production Tips
        </CardTitle>
        <CardDescription>
          Enter farmer's milk test history and local agricultural data to receive personalized production improvement tips.
          Data should be in JSON format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="previousMilkTests">Previous Milk Tests (JSON)</Label>
          <Textarea
            id="previousMilkTests"
            value={previousMilkTests}
            onChange={(e) => setPreviousMilkTests(e.target.value)}
            placeholder={defaultPreviousMilkTests}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <Label htmlFor="localAgriculturalData">Local Agricultural Data (JSON)</Label>
          <Textarea
            id="localAgriculturalData"
            value={localAgriculturalData}
            onChange={(e) => setLocalAgriculturalData(e.target.value)}
            placeholder={defaultLocalAgriculturalData}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
         <Button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Tips
        </Button>
      </CardContent>
      {generatedTips && (
        <CardFooter className="flex-col items-start gap-2 border-t pt-4">
            <h3 className="font-semibold text-lg">Generated Tips:</h3>
            <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4 whitespace-pre-wrap">
                {generatedTips}
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
