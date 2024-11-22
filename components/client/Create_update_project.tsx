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
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useState } from "react";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader, Pencil } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  projectName: z.string().min(2).max(50),
  projectDescription: z.string().min(2).max(400),
});

const Create_update_project = ({
  type,
  id,
  name = "",
  description = "",
}: {
  type: "create" | "update";
  id?: string;
  name?: string;
  description?: string;
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: name,
      projectDescription: description,
    },
  });

  useEffect(() => {
    if (type === "update") {
      // Set form values when opening the update dialog
      form.setValue("projectName", name);
      form.setValue("projectDescription", description);
    }
  }, [type, name, description, form]); // Only run this when `name`, `description`, or `type` change

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res;
    setProcessing(true);
    try {
      if (type == "create") {
        res = await createProject({
          projectName: values.projectName,
          projectDescription: values.projectDescription,
        });
      } else if (type == "update" && id) {
        res = await updateProject({
          projectId: id,
          projectName: values.projectName,
          projectDescription: values.projectDescription,
        });
        form.setValue("projectName", values.projectName);
        form.setValue("projectDescription", values.projectDescription);
      }
      setProcessing(false);
      if (res) {
        if (res.success) {
          form.reset();
          toast({
            title: "Success",
            description: `Project ${
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
            disabled={processing}
            className="rounded-2xl w-full sm:w-fit py-6 sm:py-4 sm:mt-0"
          >
            {processing ? (
              <>
                <Loader className="mr-2 animate-spin" />
                <span>Creating</span>
              </>
            ) : (
              "Create project"
            )}
          </Button>
        ) : (
          <Button disabled={processing} size="icon">
            {processing ? <Loader className="animate-spin" /> : <Pencil />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none sm:rounded-2xl p-6 md:p-8 tracking-wide">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {type === "create" ? "Create" : "Update"} project
          </DialogTitle>
          <DialogDescription>
            {type === "create" ? "Create a new project" : "Update your project"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button
                className="w-full rounded-xl"
                type="submit"
                disabled={!form.formState.isDirty || processing} // Disable if form is not dirty or processing
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

export default Create_update_project;
