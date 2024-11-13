"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { acceptOrRejectTask } from "@/lib/actions/task.actions";
import { Loader } from "lucide-react";

const formSchema = z.object({
  note: z.string().min(2).max(50),
});

const AccOrRejTask = ({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });

  async function handler(type: "accept" | "reject", note?: string) {
    try {
      setProcessing(true);
      const { success, message } = await acceptOrRejectTask({
        projectId,
        taskId,
        type,
        note,
      });

      form.reset();

      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={processing} variant="secondary">
            {processing ? (
              <Loader className="animate-spin" />
            ) : (
              <span>Reject</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(({ note }) =>
                handler("reject", note)
              )}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a note" {...field} />
                    </FormControl>
                    <FormDescription>
                      This note will be submitted with your action.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose asChild>
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Button disabled={processing} onClick={() => handler("accept")}>
        {processing ? <Loader className="animate-spin" /> : <span>Accept</span>}
      </Button>
    </>
  );
};

export default AccOrRejTask;
