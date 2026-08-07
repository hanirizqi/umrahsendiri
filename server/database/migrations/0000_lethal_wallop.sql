CREATE TABLE "lead_service_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"hotel_tier" smallint,
	"quantity" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_number" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"pax" integer NOT NULL,
	"departure_target" text,
	"flight_status" text,
	"hotel_status" text,
	"plan_status" text,
	"hotel_tier" smallint,
	"nights_makkah" integer,
	"nights_madinah" integer,
	"pembimbing_days" integer,
	"message" text,
	"referral_name" text,
	"referral_phone" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"gclid" text,
	"ga_client_id" text,
	"landing_page" text,
	"referrer" text,
	"source" text DEFAULT 'web_form' NOT NULL,
	"status" text DEFAULT 'baru' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "leads_lead_number_unique" UNIQUE("lead_number")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"pricing_unit" text DEFAULT 'per_pax' NOT NULL,
	"needs_hotel_tier" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "lead_service_selections" ADD CONSTRAINT "lead_service_selections_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_service_selections" ADD CONSTRAINT "lead_service_selections_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lead_service_unique" ON "lead_service_selections" USING btree ("lead_id","service_id");--> statement-breakpoint
CREATE INDEX "lead_service_lead_idx" ON "lead_service_selections" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "leads_gclid_idx" ON "leads" USING btree ("gclid");