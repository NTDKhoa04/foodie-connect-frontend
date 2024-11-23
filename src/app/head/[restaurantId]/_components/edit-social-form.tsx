import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { ErrorType } from "@/types/error.type";
import { UpdateSocialBody, UpdateSocialBodyType } from "@/schema/social.schema";
import useSocials from "@/hooks/use-socials";
import { SocialLink } from "@/types/social.type";

export default function EditSocialForm({
  social,
  onSuccess,
}: {
  social: SocialLink;
  onSuccess: () => void;
}) {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<UpdateSocialBodyType>({
    resolver: zodResolver(UpdateSocialBody),
    defaultValues: {
      id: social.id,
      platformType: social.platformType,
      url: social.url,
    },
    mode: "onChange",
  });
  const updateSocial = useSocials.useUpdateSocial();

  useEffect(() => {
    form.reset({
      id: social.id,
      platformType: social.platformType,
      url: social.url,
    });
  }, [social]);

  async function onSubmit(values: UpdateSocialBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      await updateSocial.mutateAsync({
        restaurantId,
        socialId: social.id,
        socialDetails: values,
      });
      console.log(values);
      toast({
        title: "Success",
        description: "Social updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.log(error);
      switch ((error as ErrorType).code) {
        case "SOCIAL_ALREADY_EXISTS":
          toast({
            title: "Error",
            description: "Social already exists",
            variant: "destructive",
          });
          break;
        case "NOT_AUTHENTICATED":
          toast({
            title: "Error",
            description: "You are not authenticated",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Error",
            description: "An error occurred",
            variant: "destructive",
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex-shrink-0 space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="platformType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-bold">
                  Platform Type
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="flex h-[48px] items-center">
                      {" "}
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="Facebook"
                      >
                        Facebook
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="Twitter"
                      >
                        Twitter
                      </SelectItem>
                      <SelectItem
                        className="hover:cursor-pointer"
                        value="Tiktok"
                      >
                        Tiktok
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Select the platform type of the social media
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-bold">Url</FormLabel>
                <FormControl>
                  <Input
                    className="h-[60px]"
                    placeholder="Enter category name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size={"lg"} className="!mt-8 w-full">
            Update Social
          </Button>
        </form>
      </Form>
    </>
  );
}