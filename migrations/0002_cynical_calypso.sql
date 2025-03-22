CREATE TABLE "quota" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"limit" integer NOT NULL,
	"used" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "plan" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "quota" ADD CONSTRAINT "quota_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;