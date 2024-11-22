"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  dayNumber: z.preprocess(
    (value) => Number(value), // Convert the input to a number
    z
      .number()
      .min(1, { message: "The number of days must be at least 1" })
      .max(30, { message: "The number of days cannot exceed 30" })
  ),
});

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addDaysToSprint } from "@/lib/actions/sprint.actions";

const AddDays = ({ projectId }: { projectId: string }) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayNumber: 7, // Ensure this is properly typed as a number
    },
    mode: "onChange", // Ensure validation updates in real-time
  });

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("Number of days:", values.dayNumber);
    try {
      setProcessing(true);
      const { success, title, message } = await addDaysToSprint(
        projectId,
        values.dayNumber
      );
      toast({
        title,
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" disabled={processing}>
          {processing ? <Loader2 className="animate-spin" /> : <CalendarPlus />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add additional days</DialogTitle>
          <DialogDescription>
            Add additional days to the current sprint. If the current sprint is
            finished, a new sprint will be created.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="dayNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter a number between 1 and 30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between flex-wrap">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" disabled={!form.formState.isValid}>
                    Add
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDays;
