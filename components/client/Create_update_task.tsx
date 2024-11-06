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
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useState } from "react";
import { createProject } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { createTask } from "@/lib/actions/task.actions";

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
}: {
  type: "create" | "update";
  projectId: string;
  taskId?: string;
  name?: string;
  description?: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: name,
      taskDescription: description,
      weightage: 1,
    },
  });

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
        // res = await updateTask({});
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
        <Button
          disabled={processing}
          className="rounded-2xl w-full sm:w-fit py-6 sm:py-4 mt-4 sm:mt-0"
        >
          {processing ? (
            <div className="flex items-center flex-row gap-2">
              <Loader className="animate-spin" />
              {type === "create" ? "Creating..." : "Updating..."}
            </div>
          ) : (
            `${type === "create" ? "Create" : "Update"} Task`
          )}
        </Button>
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
            {/* <FormField
              control={form.control}
              name="weightage"
              render={({ field }) => (
                <FormItem>
                  <label
                    htmlFor="weightage-dropdown"
                    className="flex flex-col gap-2 cursor-pointer"
                  >
                    <FormLabel>Weightage</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button id="weightage-dropdown" variant="outline">
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
                              className="p-2 hover:pl-3 hover:text-primary transition-all"
                              key={i + 1}
                              value={String(i + 1)}
                            >
                              {i + 1}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
              <Button className="w-full rounded-xl" type="submit">
                {type === "create" ? "Create" : "Update"} task
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Create_update_task;
