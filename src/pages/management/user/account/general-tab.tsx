import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import apiClient from "@/api/apiClient";
import { Icon } from "@/components/icon";
import { UserAvatar } from "@/components/user-avatar";
import { useAdminProfile, useUpdateAdminProfile } from "@/hooks/use-activity";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Skeleton } from "@/ui/skeleton";

type FieldType = {
	fullName: string;
	email: string;
	phone: string;
};

export default function GeneralTab() {
	const { data: profileData, isLoading, refetch } = useAdminProfile();
	const updateProfileMutation = useUpdateAdminProfile();
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const profile = profileData?.profile;

	const form = useForm<FieldType>({
		values: {
			fullName: profile?.fullName || "",
			email: profile?.email || "",
			phone: profile?.phone || "",
		},
	});

	const handleSubmit = (data: FieldType) => {
		updateProfileMutation.mutate({
			fullName: data.fullName,
			phone: data.phone,
		});
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Only image files are allowed (JPEG, PNG, GIF, WebP)");
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File too large. Maximum size is 5MB");
			return;
		}

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("image", file);

			await apiClient.post({
				url: "/users/profile-picture",
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			toast.success("Profile picture uploaded successfully");
			refetch();
		} catch (error) {
			toast.error("Failed to upload profile picture");
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<Card className="col-span-1">
					<CardContent className="flex flex-col items-center py-8">
						<Skeleton className="h-32 w-32 rounded-full" />
						<Skeleton className="mt-4 h-6 w-32" />
						<Skeleton className="mt-2 h-4 w-48" />
					</CardContent>
				</Card>
				<Card className="col-span-1 lg:col-span-2">
					<CardContent className="space-y-4 py-6">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-10 w-full" />
						))}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<Card className="col-span-1">
				<CardHeader>
					<CardTitle className="text-lg">Profile Picture</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center pb-8">
					<div className="relative">
						<UserAvatar src={profile?.image} name={profile?.fullName || "Admin"} email={profile?.email} size="xl" />
						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
							onChange={handleImageUpload}
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
							className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 disabled:opacity-50"
						>
							{uploading ? (
								<Icon icon="solar:refresh-outline" size={16} className="animate-spin" />
							) : (
								<Icon icon="solar:camera-outline" size={16} />
							)}
						</button>
					</div>
					<h3 className="mt-4 text-lg font-semibold">{profile?.fullName}</h3>
					<p className="text-sm text-muted-foreground">{profile?.email}</p>
					<p className="mt-1 text-xs text-muted-foreground capitalize">{profile?.role}</p>
					<p className="mt-4 text-xs text-muted-foreground">Allowed: JPEG, PNG, GIF, WebP (max 5MB)</p>
				</CardContent>
			</Card>

			<Card className="col-span-1 lg:col-span-2">
				<CardHeader>
					<CardTitle className="text-lg">Account Information</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="fullName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Enter your full name" />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} disabled className="bg-muted" />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Enter your phone number" />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="flex justify-end pt-4">
								<Button type="submit" disabled={updateProfileMutation.isPending}>
									{updateProfileMutation.isPending ? (
										<>
											<Icon icon="solar:refresh-outline" size={16} className="mr-2 animate-spin" />
											Saving...
										</>
									) : (
										"Save Changes"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
