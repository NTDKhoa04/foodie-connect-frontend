"use client";
import { ReviewBody, ReviewSchema } from "@/schema/review.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Utensils } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ReviewTag } from "./review-card";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FormField } from "./ui/form";

import useAuth from "@/hooks/use-auth";
import useDishReview from "@/hooks/use-dish-review";
import { toast } from "@/hooks/use-toast";
import { getAvatarUrl, getInitials } from "@/lib/handleImage";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";

export enum ReviewEnum {
  RESTAURANT,
  DISH,
}

const DishReviewForm = ({
  id,
  isEditting,
  review,
  refetch,
  onCancelReview,
}: {
  id?: string;
  isEditting: boolean;
  review: any;
  refetch?: Array<() => void>;
  onCancelReview: () => void;
}) => {
  const { data: user } = useAuth.useGetSession();
  const createDishReview = useDishReview.useCreateDishReview();
  const updateDishReview = useDishReview.useUpdateDishReview();
  const [loading, setLoading] = useState(false);

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    const [hover, setHover] = useState<number | null>(1);
    const rating = value;

    const renderStar = (index: number) => {
      const filled = (hover ?? rating) >= index + 1;
      return (
        <Star
          key={index}
          fill={filled ? "#D4AF37" : "none"}
          size={20}
          stroke="#D4AF37"
          className="transition-colors hover:cursor-pointer"
          onMouseEnter={() => setHover(index + 1)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(index + 1)}
        />
      );
    };

    return (
      <div className="flex flex-row">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
    );
  };

  const form = useForm<ReviewBody>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      content: review?.content ?? "",
      rating: review?.rating ?? 1,
    },
  });

  const onSubmit = async (value: ReviewBody) => {
    try {
      if (isEditting && id && review) {
        await updateDishReview.mutateAsync({
          dishId: id,
          reviewId: review.reviewId,
          review: value,
        });
      } else if (id) {
        await createDishReview.mutateAsync({
          dishId: id,
          review: value,
        });
      }

      toast({
        title: "Success",
        description: "Review submitted",
      });

      refetch?.forEach((fn) => fn());
      onCancelReview();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Construct context based on user
  let context: FormContext;

  if (!user) {
    context = new FormContext(new GuestState());
  } else if (!user.emailConfirmed) {
    context = new FormContext(new UnverifiedState());
  } else {
    const formJSX = (
      <form onSubmit={form.handleSubmit((data) => context.submit(data))}>
        <Card className="relative mb-2 border-none dark:bg-muted/20">
          <CardHeader className="border-b border-muted-foreground/30 py-2">
            <CardTitle className="flex flex-row items-center justify-between">
              {/* reviewer info */}
              <div className="flex flex-row md:space-x-2">
                <Avatar>
                  <AvatarImage
                    src={getAvatarUrl(user?.avatar, user?.displayName)}
                    alt={user?.displayName}
                  />
                  <AvatarFallback>
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm">{user?.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    @{user?.userName}
                  </span>
                </div>
              </div>

              <Controller
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <StarRating
                    value={field.value ? field.value : 1}
                    onChange={field.onChange}
                  />
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5 flex flex-row">
            {/* review content */}
            <FormField
              control={form.control}
              name="content"
              render={(field) => (
                <Textarea
                  placeholder="Leave your review here!"
                  {...form.register("content")}
                >
                  {review && review.content}
                </Textarea>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-row space-x-3">
            <Button type="submit" disabled={!form.formState.isValid || loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
            {isEditting && (
              <Button onClick={onCancelReview} variant={"ghost"}>
                Cancel
              </Button>
            )}
          </CardFooter>

          <ReviewTag className="bottom-0 right-7 rounded-t">
            <Utensils size={20}></Utensils>
          </ReviewTag>
        </Card>
      </form>
    );

    const activeState = new ActiveState(formJSX, onSubmit);
    context = new FormContext(activeState);
  }

  return context.render();
};

export default DishReviewForm;
interface UserState {
  render(): JSX.Element;
  submit?(formData: ReviewBody): void;
}

class FormContext {
  private state: UserState;

  constructor(initialState: UserState) {
    this.state = initialState;
  }

  setState(state: UserState) {
    this.state = state;
  }

  render() {
    return this.state.render();
  }

  submit(formData: ReviewBody) {
    this.state.submit?.(formData);
  }
}

class GuestState implements UserState {
  render() {
    return (
      <Link href={"/login"}>
        <Card className="mb-2 flex items-center border-none py-2 dark:bg-muted/20 md:px-6">
          <Image
            src="/images/logo-dark.png"
            width={50}
            height={50}
            alt="logo"
            className="absolute size-0 md:relative md:size-auto"
          />
          <CardContent className="flex w-full items-center p-0">
            <CardTitle className="w-full text-center text-sm text-primary xl:text-lg">
              Login now to leave a review!
            </CardTitle>
          </CardContent>
        </Card>
      </Link>
    );
  }

  submit() {
    toast({
      title: "Error",
      description: "Please login to leave a review",
      variant: "destructive",
    });
  }
}

class UnverifiedState implements UserState {
  render() {
    return (
      <Link href={"/settings"}>
        <Card className="mb-2 flex items-center border-none py-2 dark:bg-muted/20 md:px-6">
          <Image
            src="/images/logo-dark.png"
            width={50}
            height={50}
            alt="logo"
            className="absolute size-0 md:relative md:size-auto"
          />
          <CardContent className="flex w-full items-center p-0">
            <CardTitle className="w-full text-center text-sm text-primary xl:text-lg">
              Verify your email to leave a review!
            </CardTitle>
          </CardContent>
        </Card>
      </Link>
    );
  }

  submit() {
    toast({
      title: "Error",
      description: "Please verify your email to leave a review",
      variant: "destructive",
    });
  }
}

class ActiveState implements UserState {
  constructor(
    private form: JSX.Element,
    public submit?: (formData: ReviewBody) => void,
  ) {}

  render() {
    return this.form;
  }
}
