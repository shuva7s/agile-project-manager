"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader, Pencil } from "lucide-react";
import { createTask, updateTask } from "@/lib/actions/task.actions";

const formSchema = z.object({
  taskName: z.string().min(2).max(50),
  taskDescription: z.string().min(2).max(400),
  weightage: z.number().min(1).max(10).default(1),
});

const Create_update_task = ({
  type,
  projectId,
  taskId,
  name = "",
  description = "",
  priority,
}: {
  type: "create" | "update";
  projectId: string;
  taskId?: string;
  name?: string;
  description?: string;
  priority?: number;
}) => {
  const [processing, setProcessing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: name,
      taskDescription: description,
      weightage: priority || 1,
    },
  });

  useEffect(() => {
    if (type === "update") {
      form.setValue("taskName", name);
      form.setValue("taskDescription", description);
      form.setValue("weightage", priority || 1);
    }
  }, [type, name, description, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;
    setProcessing(true);
    try {
      if (type === "create") {
        res = await createTask({
          projectId,
          taskName: values.taskName,
          taskDescription: values.taskDescription,
          weightage: values.weightage,
        });
      } else if (type === "update" && taskId) {
        res = await updateTask({
          projectId,
          taskId,
          taskName: values.taskName,
          taskDescription: values.taskDescription,
          weightage: values.weightage,
        });
        form.setValue("taskName", values.taskName);
        form.setValue("taskDescription", values.taskDescription);
        form.setValue("weightage", values.weightage);
      }
      setProcessing(false);
      if (res) {
        if (res.success) {
          form.reset();
          toast({
            title: "Success",
            description: `Task ${
              type === "create" ? "created" : "updated"
            } successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: res.message,
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      setProcessing(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            variant="secondary"
            disabled={processing}
            className="rounded-2xl w-full sm:w-fit py-6 sm:py-4 sm:mt-0"
          >
            {processing ? (
              <>
                <Loader className="mr-2 animate-spin" />
                <span>Creating</span>
              </>
            ) : (
              "Create task"
            )}
          </Button>
        ) : (
          <Button variant="outline" disabled={processing} size="icon">
            {processing ? <Loader className="animate-spin" /> : <Pencil />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none sm:rounded-2xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {type === "create" ? "Create" : "Update"} Task
          </DialogTitle>
          <DialogDescription>
            {type === "create" ? "Create a new task" : "Update your task"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task description"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightage"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-center gap-2 items-center">
                    <FormLabel
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="cursor-pointer"
                    >
                      Weightage
                    </FormLabel>
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          {field.value || "Select weightage"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 p-1">
                        <DropdownMenuRadioGroup
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          {[...Array(10)].map((_, i) => (
                            <DropdownMenuRadioItem
                              className="p-2 hover:pl-3 transition-all"
                              key={i + 1}
                              value={String(i + 1)}
                            >
                              {i + 1}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button
                className="w-full rounded-xl"
                type="submit"
                disabled={!form.formState.isDirty || processing}
              >
                {type === "create" ? "Create" : "Update"}
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Create_update_task;
