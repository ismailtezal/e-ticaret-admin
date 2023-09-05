"use client"

import * as z from "zod";
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
    name: z.string().min(4,{
        message:"Mağaza adı en az 4 harften oluşmalıdır"
    }),
})

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const response = await axios.post('/api/stores', values)
            
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            toast.error("Bir şeyler ters gitti")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Mağaza oluştur"
            description="Ürünlerinizi sergileyeceğiniz yeni bir mağaza oluşturun!"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="py-2 pb-4 space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mağaza Adı</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="E-Ticaret"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center w-full justify-end pt-6 space-x-2">
                                <Button disabled={isLoading} variant={"outline"} onClick={storeModal.onClose}>Vazgeç</Button>
                                <Button disabled={isLoading} type="submit">Devam et</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
