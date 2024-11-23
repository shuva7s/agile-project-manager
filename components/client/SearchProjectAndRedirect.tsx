"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { searchProject } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  project_id: z.string().length(24),
});

const SearchProjectAndRedirect = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: "",
    },
  });

  // Watch for the value of the project_id field
  const projectId = form.watch("project_id");
  const isProjectIdValid = projectId.length === 24;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setProcessing(true);
      const { success, message } = await searchProject(values.project_id);
      if (success) {
        router.push(`/project/${values.project_id}`);
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
        <h2 className="text-center md:text-left text-lg text-primary tracking-wide">
          Search and send join request.
        </h2>
        <div className="flex gap-4 flex-row flex-wrap">
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="py-5 w-80"
                    placeholder="Enter project id"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={processing || !isProjectIdValid} type="submit">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchProjectAndRedirect;
