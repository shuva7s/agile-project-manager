"use client";

import { Button } from "@/components/ui/button";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader, Loader2, UserRoundPlus } from "lucide-react";
import {
  addMembersToTask,
  getMembersForTask,
} from "@/lib/actions/task.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  mems: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function AssignMember({
  projectId,
  taskId,
  className,
}: {
  projectId: string;
  taskId: string;
  className?: string;
}) {
  const [members, setMembers] = useState<any>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mems: [],
    },
  });

  async function loadMembers() {
    try {
      setMembersLoading(true);
      const { success, members } = await getMembersForTask(projectId, taskId);
      if (success) setMembers(members);
    } catch (error) {
    } finally {
      setMembersLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setButtonDisabled(true);
      const { success, message } = await addMembersToTask(
        projectId,
        taskId,
        data.mems
      );
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
      setButtonDisabled(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(className)}
          disabled={buttonDisabled}
          variant="outline"
          size="icon"
          onClick={loadMembers}
        >
          {buttonDisabled ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <UserRoundPlus />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Members</DialogTitle>
          <DialogDescription>
            Select members to assign to the task.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="mems"
                render={({ field }) => (
                  <FormItem>
                    {membersLoading ? (
                      <div className="flex w-full py-6 justify-center items-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      </div>
                    ) : members.length > 0 ? (
                      members.map((member: any) => (
                        <FormItem
                          key={member._id}
                          className="flex flex-row items-center gap-2 p-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="p-0 m-0"
                              checked={field.value?.includes(member._id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, member._id]
                                  : field.value.filter(
                                      (value) => value !== member._id
                                    );
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel>
                            <div className="flex flex-row items-center gap-2">
                              <Avatar>
                                <AvatarImage src={member.photo} />
                                <AvatarFallback>
                                  <Skeleton className="w-12 h-12 rounded-full bg-primary/50" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">
                                  {member.firstName !== "" &&
                                  member.lastName !== ""
                                    ? `${member.firstName} ${member.lastName}`
                                    : member.username}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </FormLabel>
                        </FormItem>
                      ))
                    ) : (
                      <p className="text-center text-sm text-primary">
                        All members are assigned to this task.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose asChild>
                <Button className="w-full" type="submit">
                  Confirm
                </Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
