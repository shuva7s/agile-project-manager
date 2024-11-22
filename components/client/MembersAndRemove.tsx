"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Loader2, UserMinus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getAssignedMembersForTask,
  removeMembersFromTask,
} from "@/lib/actions/task.actions";

const FormSchema = z.object({
  mems: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one member to remove.",
  }),
});

const MembersAndRemove = ({
  isAdmin,
  taskSubmitted,
  projectId,
  taskId,
  assignedPeople,
  className,
}: {
  isAdmin: boolean;
  taskSubmitted: boolean;
  projectId: string;
  taskId: string;
  assignedPeople: any;
  className?: string;
}) => {
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

  async function loadAssignedMembers() {
    try {
      setMembersLoading(true);
      const { success, members } = await getAssignedMembersForTask(
        projectId,
        taskId
      );
      if (success) setMembers(members);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load members.",
        variant: "destructive",
      });
    } finally {
      setMembersLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setButtonDisabled(true);
      const { success, message } = await removeMembersFromTask(
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
      <DialogTrigger
        onClick={loadAssignedMembers}
        className="flex flex-row items-center -space-x-4"
      >
        {assignedPeople.slice(0, 3).map((member: any) => (
          <Avatar key={member._id} className="w-9 h-9">
            <AvatarImage src={member.photo} />
            <AvatarFallback>
              <div className="w-9 h-9 rounded-full bg-primary/50" />
            </AvatarFallback>
          </Avatar>
        ))}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAdmin ? "Remove Members" : "Members"}</DialogTitle>
          <DialogDescription>
            {isAdmin ? "Remove members from the task." : "Members assigned to this task."}
          </DialogDescription>
        </DialogHeader>

        {isAdmin ? (
          <>
            {!taskSubmitted ? (
              <div className="max-h-[65vh] overflow-y-auto">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
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
                                <FormLabel className="w-full">
                                  <div className="flex flex-row items-center gap-2">
                                    <Avatar>
                                      <AvatarImage src={member.photo} />
                                      <AvatarFallback>
                                        <Skeleton className="w-12 h-12 rounded-full bg-primary/50" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
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
                              No members are currently assigned to this task.
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        type={members.length === 0 ? "button" : "submit"}
                      >
                        {members.length === 0 ? "Close" : "Remove"}
                      </Button>
                    </DialogClose>
                  </form>
                </Form>
              </div>
            ) : (
              <p className="text-center">Already submitted</p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {members.map((member: any) => (
              <div
                key={member.username}
                className="flex flex-row items-center gap-2"
              >
                <Avatar>
                  <AvatarImage src={member.photo} />
                  <AvatarFallback>
                    <Skeleton className="w-12 h-12 rounded-full bg-primary/50" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {member.firstName !== "" && member.lastName !== ""
                      ? `${member.firstName} ${member.lastName}`
                      : member.username}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MembersAndRemove;
