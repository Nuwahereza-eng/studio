
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Droplets, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { mockFarmers } from "@/lib/mock-data"; // For farmer selection
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const deliverySchema = z.object({
  farmerId: z.string({ required_error: "Please select a farmer." }).min(1, "Please select a farmer."), // Ensure non-empty
  date: z.date({ required_error: "Delivery date is required." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  quantityLiters: z.coerce.number().min(0.1, "Quantity must be greater than 0."),
  quality: z.enum(["Good", "Fair", "Poor"], { required_error: "Milk quality is required." }),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

export function MilkDeliveryForm() {
  const { toast } = useToast();
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      farmerId: "", // Initialize as empty string
      quantityLiters: "", // Initialize as empty string
      time: format(new Date(), "HH:mm"),
      date: new Date(),
      quality: "Good",
    },
  });

  async function onSubmit(data: DeliveryFormValues) {
    console.log(data);
    toast({
      title: "Milk Delivery Recorded",
      description: `Delivery for farmer ID ${data.farmerId} of ${data.quantityLiters}L recorded.`,
    });
    form.reset({
        farmerId: '',
        quantityLiters: "", // Reset to empty string to show placeholder
        quality: 'Good',
        time: format(new Date(), "HH:mm"),
        date: new Date(),
    });
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Droplets className="h-6 w-6" />Record Milk Delivery</CardTitle>
            <CardDescription>Enter the details of the milk delivery by a farmer.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="farmerId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Farmer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}> {/* Ensure value is passed */}
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a farmer" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {mockFarmers.map(farmer => (
                            <SelectItem key={farmer.id} value={farmer.id}>
                            {farmer.name} ({farmer.id})
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, "PPP")
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time (HH:MM)</FormLabel>
                            <FormControl>
                            <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <FormField
                control={form.control}
                name="quantityLiters"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantity (Liters)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 15.5" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Milk Quality</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}> {/* Ensure value is passed */}
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full md:w-auto">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Record Delivery
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
