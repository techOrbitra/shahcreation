CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clothes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"old_price" integer,
	"images" json DEFAULT '[]'::json NOT NULL,
	"material" varchar(100),
	"sizes" json DEFAULT '["S","M","L","XL","XXL"]'::json,
	"fit_type" varchar(50),
	"care_instructions" text,
	"origin" varchar(100) DEFAULT 'India',
	"warranty" varchar(100),
	"stock" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clothes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clothes_to_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"cloth_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"customer_whatsapp" varchar(20),
	"customer_address" text,
	"items" json NOT NULL,
	"total_amount" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_page_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) DEFAULT '+91 98765 43210' NOT NULL,
	"phone_hours" varchar(100) DEFAULT 'Mon-Sat 9AM-8PM',
	"email" varchar(255) DEFAULT 'hello@shahcreation.com' NOT NULL,
	"address" text DEFAULT '123 Fashion Street, Siddhapur, Gujarat',
	"working_hours" text DEFAULT 'Mon-Sat: 9AM - 8PM
Sunday: 10AM - 6PM',
	"map_image_url" varchar(500),
	"google_maps_link" varchar(500),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_page_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_title" varchar(255) DEFAULT 'Shah Creation' NOT NULL,
	"hero_subtitle" text DEFAULT 'Crafting luxury fashion since 2025',
	"hero_description" text,
	"mission_title" varchar(100) DEFAULT 'Our Mission',
	"mission_text" text,
	"vision_title" varchar(100) DEFAULT 'Our Vision',
	"vision_text" text,
	"values_title" varchar(100) DEFAULT 'Our Values',
	"values_text" text,
	"story_title" varchar(255) DEFAULT 'Our Legacy of Excellence',
	"story_paragraph1" text,
	"story_paragraph2" text,
	"story_image_url" varchar(500),
	"stats" json DEFAULT '{"clients":"500+","collections":"50+","quality":"100%"}'::json,
	"features" json DEFAULT '[]'::json,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothes_to_categories" ADD CONSTRAINT "clothes_to_categories_cloth_id_clothes_id_fk" FOREIGN KEY ("cloth_id") REFERENCES "public"."clothes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothes_to_categories" ADD CONSTRAINT "clothes_to_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;