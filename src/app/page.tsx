'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Bot, Copy, Flame, Languages, Loader2, Skull } from 'lucide-react';

import { generateSarcasticReply } from '@/ai/flows/generate-sarcastic-reply';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Come on, say something. The AI is waiting.' }).max(280, { message: 'Keep it brief, genius. 280 chars max.' }),
  language: z.enum(['English', 'Kiswahili', 'Sheng']),
  sarcasmLevel: z.enum(['Mild', 'Medium', 'Nuclear']),
});

type FormValues = z.infer<typeof formSchema>;

const languageOptions: { value: FormValues['language']; label: string }[] = [
  { value: 'English', label: 'English' },
  { value: 'Kiswahili', label: 'Kiswahili' },
  { value: 'Sheng', label: 'Sheng' },
];

const sarcasmOptions: { value: FormValues['sarcasmLevel']; label: string; icon: React.ReactNode }[] = [
  { value: 'Mild', label: 'Mild', icon: <Flame className="h-4 w-4 text-accent" /> },
  { value: 'Medium', label: 'Medium', icon: <><Flame className="h-4 w-4 text-accent" /><Flame className="h-4 w-4 text-accent" /></> },
  { value: 'Nuclear', label: 'Nuclear', icon: <Skull className="h-4 w-4 text-accent" /> },
];

export default function EehSawaAiPage() {
  const [reply, setReply] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      language: 'English',
      sarcasmLevel: 'Medium',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReply('');
    try {
      const result = await generateSarcasticReply(values);
      setReply(result.reply);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! The AI is sulking.',
        description: 'Something went wrong. Please try again later.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    toast({
      title: 'Copied to clipboard!',
      description: 'Now go forth and be sarcastic.',
    });
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">EehSawa AI</h1>
          <p className="mt-2 text-lg text-muted-foreground">Your friendly neighborhood sarcastic AI.</p>
        </header>

        <Card className="shadow-2xl shadow-primary/5">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell the AI what's on your mind..."
                          className="min-h-[100px] resize-none text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Languages className="h-5 w-5" /> Language
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {languageOptions.map((option) => (
                              <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sarcasmLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Flame className="h-5 w-5" /> Sarcasm Level
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {sarcasmOptions.map((option) => (
                              <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="flex items-center gap-2 font-normal">
                                  {option.label}
                                  <span className="flex">{option.icon}</span>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full text-lg" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Sarcasm'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {reply && (
          <div className="mt-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>The AI has spoken</CardTitle>
                <CardDescription>Here's your brilliant, custom-made sarcastic reply.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg bg-muted p-6">
                  <p className="text-lg font-medium leading-relaxed text-foreground">{reply}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:bg-background"
                    onClick={handleCopy}
                    aria-label="Copy reply"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
