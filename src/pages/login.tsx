import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { PasswordInput } from "@/components/ui/password-input";
import Header from "@/components/Header";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const formSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Bu Alan zorunludur." })
    .min(6, { message: "Kullanıcı Adı en az 6 karakter olmalıdır." })
    .max(26, { message: "Kullanıcı Adı en fazla 26 karakter olabilir." }),
  password: z
    .string()
    .nonempty({ message: "Bu Alan zorunludur." })
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
    .max(26, { message: "Şifre en fazla 26 karakter olabilir." }),
});

export default function MyForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="));
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: { username: string; password: string }) => {
      try {
        const response = await axios.post("https://dummyjson.com/auth/login", {
          username: formData.username,
          password: formData.password,
          expiresInMins: 30,
        });

        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data?.message || "Giriş yapılırken bir hata oluştu"
          );
        }
        throw new Error("Giriş yapılırken bir hata oluştu");
      }
    },
    onSuccess: (data) => {
      const accessToken = data?.accessToken;
      if (accessToken) {
        document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict; max-age=3600`;

        toast.success("Giriş Başarılı", {
          action: {
            label: "Kapat",
            onClick: () => console.log("Kapatıldı"),
          },
        });
      }

      navigate("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Giriş Başarısız";
      toast.warning(errorMessage, {
        action: {
          label: "Kapat",
          onClick: () => console.log("Kapatıldı"),
        },
      });
      console.error(errorMessage);
    },
  });

  const onSubmit = (values: { username: string; password: string }) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <Header />
      <div className="max-lg:px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto py-10 pt-[90px]"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Kullanıcı Adı" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Şifrenizi Giriniz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Giriş Yap</Button>
            <p>
              Kullanıcı Adı ve Şifre Bilgilerine
              <a
                target="_blank"
                href="https://dummyjson.com/users"
                className="text-blue-500 hover:text-blue-700"
              >
                {" "}
                Buradan{" "}
              </a>
              Ulaşabilirsiniz.
            </p>
          </form>
        </Form>
      </div>

      <Footer />
    </div>
  );
}
