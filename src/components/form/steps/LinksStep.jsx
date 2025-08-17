"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LinksStep({ form }) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Professional Links
        </h2>
        <p className="text-muted-foreground">Add your professional profiles and links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LinkedIn */}
        <div>
          <Label htmlFor="linkedIn" className="text-sm font-medium text-foreground">
            LinkedIn Profile
          </Label>
          <Controller
            name="linkedIn"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="linkedIn"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                className="mt-1"
              />
            )}
          />
        </div>

        {/* GitHub */}
        <div>
          <Label htmlFor="github" className="text-sm font-medium text-foreground">
            GitHub Profile
          </Label>
          <Controller
            name="github"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="github"
                type="url"
                placeholder="https://github.com/yourusername"
                className="mt-1"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
