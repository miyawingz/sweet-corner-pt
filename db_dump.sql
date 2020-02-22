--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: image_type; Type: TYPE; Schema: public; Owner: dev
--

CREATE TYPE public.image_type AS ENUM (
    'full_image',
    'thumbnail'
);


ALTER TYPE public.image_type OWNER TO dev;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cartItems; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."cartItems" (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."cartItems" OWNER TO dev;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "statusId" integer NOT NULL,
    "userId" integer,
    "lastInteraction" timestamp with time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.carts OWNER TO dev;

--
-- Name: images; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.images (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "productId" integer NOT NULL,
    "createdById" integer NOT NULL,
    "altText" text,
    name text,
    file text,
    type public.image_type,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.images OWNER TO dev;

--
-- Name: products; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.products (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdById" integer NOT NULL,
    caption text,
    cost integer NOT NULL,
    description text,
    name text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.products OWNER TO dev;

--
-- Name: thumbnailView; Type: VIEW; Schema: public; Owner: dev
--

CREATE VIEW public."thumbnailView" AS
 SELECT i."productId",
    ( SELECT row_to_json(subq.*) AS row_to_json
           FROM ( SELECT images."altText",
                    ('http://api.sc.lfzprototypes.com/images/thumbnails/'::text || images.file) AS url
                   FROM public.images
                  WHERE ((images."productId" = i."productId") AND (images.type = 'thumbnail'::public.image_type))) subq) AS thumbnail
   FROM public.images i
  WHERE (i.type = 'thumbnail'::public.image_type);


ALTER TABLE public."thumbnailView" OWNER TO dev;

--
-- Name: cartDetailView; Type: VIEW; Schema: public; Owner: dev
--

CREATE VIEW public."cartDetailView" AS
 SELECT "cartItems"."cartId",
    ( SELECT carts."userId"
           FROM public.carts
          WHERE ("cartItems"."cartId" = carts.id)) AS "userId",
    ( SELECT carts.pid
           FROM public.carts
          WHERE ("cartItems"."cartId" = carts.id)) AS pid,
    ( SELECT json_agg(detailsubq.*) AS items
           FROM ( SELECT c."updatedAt" AS added,
                    p.cost AS each,
                    c.pid AS "itemId",
                    p.name,
                    ( SELECT products.pid AS "productId"
                           FROM public.products
                          WHERE (products.id = c."productId")) AS "productId",
                    c.quantity,
                    ( SELECT "thumbnailView".thumbnail
                           FROM public."thumbnailView"
                          WHERE ("thumbnailView"."productId" = c."productId")) AS thumbnail,
                    (p.cost * c.quantity) AS total
                   FROM (public."cartItems" c
                     JOIN public.products p ON ((c."productId" = p.id)))
                  WHERE (c."cartId" = "cartItems"."cartId")) detailsubq) AS items
   FROM public."cartItems"
  GROUP BY "cartItems"."cartId";


ALTER TABLE public."cartDetailView" OWNER TO dev;

--
-- Name: cartItems_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."cartItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."cartItems_id_seq" OWNER TO dev;

--
-- Name: cartItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."cartItems_id_seq" OWNED BY public."cartItems".id;


--
-- Name: cartStatuses; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."cartStatuses" (
    id integer NOT NULL,
    mid text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."cartStatuses" OWNER TO dev;

--
-- Name: cartStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."cartStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."cartStatuses_id_seq" OWNER TO dev;

--
-- Name: cartStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."cartStatuses_id_seq" OWNED BY public."cartStatuses".id;


--
-- Name: cartTotalView; Type: VIEW; Schema: public; Owner: dev
--

CREATE VIEW public."cartTotalView" AS
 SELECT "cartItems"."cartId",
    carts."userId",
    ( SELECT row_to_json(subq.*) AS total
           FROM ( SELECT sum((c.quantity * p.cost)) AS cost,
                    sum(c.quantity) AS items
                   FROM (public."cartItems" c
                     JOIN public.products p ON ((c."productId" = p.id)))
                  WHERE (c."cartId" = "cartItems"."cartId")) subq) AS total
   FROM (public."cartItems"
     JOIN public.carts ON (("cartItems"."cartId" = carts.id)))
  GROUP BY "cartItems"."cartId", carts."userId";


ALTER TABLE public."cartTotalView" OWNER TO dev;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO dev;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO dev;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: itemView; Type: VIEW; Schema: public; Owner: dev
--

CREATE VIEW public."itemView" AS
 SELECT a.pid AS "itemId",
    ( SELECT row_to_json(itemsubq.*) AS item
           FROM ( SELECT c."updatedAt" AS added,
                    p.cost AS each,
                    c.pid AS "itemId",
                    p.name,
                    p.pid AS "productId",
                    c.quantity,
                    t.thumbnail,
                    (p.cost * c.quantity) AS total
                   FROM ((public."cartItems" c
                     JOIN public.products p ON ((c."productId" = p.id)))
                     JOIN public."thumbnailView" t ON ((t."productId" = c."productId")))
                  WHERE (c.pid = a.pid)) itemsubq) AS item,
    ( SELECT row_to_json(totalsubq.*) AS total
           FROM ( SELECT c.quantity AS items,
                    (c.quantity * p.cost) AS cost
                   FROM (public."cartItems" c
                     JOIN public.products p ON ((c."productId" = p.id)))
                  WHERE (c.pid = a.pid)) totalsubq) AS total
   FROM public."cartItems" a
  GROUP BY a.pid;


ALTER TABLE public."itemView" OWNER TO dev;

--
-- Name: orderItems; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."orderItems" (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "productId" integer NOT NULL,
    "orderId" integer NOT NULL,
    each integer NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."orderItems" OWNER TO dev;

--
-- Name: orderItems_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."orderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."orderItems_id_seq" OWNER TO dev;

--
-- Name: orderItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."orderItems_id_seq" OWNED BY public."orderItems".id;


--
-- Name: orderStatuses; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."orderStatuses" (
    id integer NOT NULL,
    mid text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."orderStatuses" OWNER TO dev;

--
-- Name: orderStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."orderStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."orderStatuses_id_seq" OWNER TO dev;

--
-- Name: orderStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."orderStatuses_id_seq" OWNED BY public."orderStatuses".id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cartId" integer NOT NULL,
    "guestId" integer,
    "userId" integer,
    "statusId" integer NOT NULL,
    "itemCount" integer NOT NULL,
    total integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.orders OWNER TO dev;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO dev;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO dev;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.users (
    id integer NOT NULL,
    pid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "roleId" integer DEFAULT 1 NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "lastAccessedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.users OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO dev;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cartItems id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartItems" ALTER COLUMN id SET DEFAULT nextval('public."cartItems_id_seq"'::regclass);


--
-- Name: cartStatuses id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartStatuses" ALTER COLUMN id SET DEFAULT nextval('public."cartStatuses_id_seq"'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: orderItems id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."orderItems" ALTER COLUMN id SET DEFAULT nextval('public."orderItems_id_seq"'::regclass);


--
-- Name: orderStatuses id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."orderStatuses" ALTER COLUMN id SET DEFAULT nextval('public."orderStatuses_id_seq"'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cartItems; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."cartItems" (id, pid, "cartId", "productId", quantity, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	201cbeca-4f5a-49eb-b20a-cba4b436cc94	1	5	101	2020-02-22 09:40:25.609889+00	2020-02-22 09:40:25.609889+00	\N
2	8557a32a-8501-41e5-8412-5692107cdc33	2	5	101	2020-02-22 09:50:29.38986+00	2020-02-22 09:50:29.38986+00	\N
11	6b03c295-9e97-45d1-8403-2867f61b5ee1	4	5	100	2020-02-22 10:48:52.321315+00	2020-02-22 10:48:52.321315+00	\N
12	0e23a8e4-4f02-4ad6-8753-d6db4f0eb5e7	4	1	100	2020-02-22 10:48:59.648509+00	2020-02-22 10:48:59.648509+00	\N
13	81b1bd79-0774-43a1-a693-b205df9a62e3	4	8	100	2020-02-22 10:49:07.658343+00	2020-02-22 10:49:07.658343+00	\N
19	c3112beb-081c-4108-8d9a-f369514a561f	6	9	300	2020-02-22 11:40:40.879595+00	2020-02-22 11:40:40.879595+00	\N
34	e2048402-7d52-46eb-90d4-11633a44e4ac	7	5	1000	2020-02-22 11:46:23.054313+00	2020-02-22 11:46:23.054313+00	\N
35	e275777a-ed33-4b7a-a5eb-84689ed85323	8	5	2	2020-02-22 18:51:51.711311+00	2020-02-22 18:51:51.711311+00	\N
38	591f41a8-4677-4c99-93e8-fc1811a0a590	4	3	10	2020-02-22 18:53:09.868569+00	2020-02-22 18:53:09.868569+00	\N
\.


--
-- Data for Name: cartStatuses; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."cartStatuses" (id, mid, name, description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	new	New	Cart is new and empty	2020-02-12 03:43:00.031794+00	2020-02-12 03:43:00.031794+00	\N
2	active	Active	Cart has items but the order has not been completed	2020-02-12 03:43:00.031794+00	2020-02-12 03:43:00.031794+00	\N
3	closed	Closed	The order has been completed and the cart is closed	2020-02-12 03:43:00.031794+00	2020-02-12 03:43:00.031794+00	\N
4	canceled	Canceled	The order has been canceled and the cart is closed	2020-02-12 03:43:00.031794+00	2020-02-12 03:43:00.031794+00	\N
5	inactive	Inactive	Cart is no longer the currently active cart, but can be reactivated	2020-02-12 03:43:00.031794+00	2020-02-12 03:43:00.031794+00	\N
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.carts (id, pid, "statusId", "userId", "lastInteraction", "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	ae005030-0901-422f-a22b-ce31f066ee86	2	\N	2020-02-22 09:40:25.591776+00	2020-02-22 09:40:25.591776+00	2020-02-22 09:40:25.591776+00	\N
2	cf157c41-8f5a-49e2-8e02-a8eae1e0c9d0	2	\N	2020-02-22 09:50:29.382505+00	2020-02-22 09:50:29.382505+00	2020-02-22 09:50:29.382505+00	\N
6	bad0ec18-c3d5-47fe-a139-42bf1acbc389	2	\N	2020-02-22 11:40:40.868283+00	2020-02-22 11:40:40.868283+00	2020-02-22 11:40:40.868283+00	\N
7	881a2096-8ac5-4cc0-8548-f342c187d7fb	2	13	2020-02-22 11:46:23.049877+00	2020-02-22 11:46:23.049877+00	2020-02-22 11:46:23.049877+00	\N
8	fbbae39e-01d3-4ccf-abca-eb8e190a94d7	2	5	2020-02-22 18:51:51.707286+00	2020-02-22 18:51:51.707286+00	2020-02-22 18:51:51.707286+00	\N
4	1655d973-07fb-41ac-b586-6df94c48ff64	2	12	2020-02-22 10:48:15.574857+00	2020-02-22 10:48:15.574857+00	2020-02-22 10:48:15.574857+00	\N
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.images (id, pid, "productId", "createdById", "altText", name, file, type, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	1c480dec-ad54-4845-ab35-048d48e9af43	1	1	Strawberry cupcake	Strawberry Delight	cupcake_sq_1.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
2	abf3d97a-ffa5-41c6-b628-473650d003db	1	1	Strawberry cupcake	Strawberry Delight	cupcake_sq_1.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
3	af93c7c0-524e-47c0-a68d-c737b68ad475	2	1	Berry cupcake	Purple Dream	cupcake_sq_2.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
4	dfddd1be-6ede-4e53-a970-ddeda5f4d02d	2	1	Berry cupcake	Purple Dream	cupcake_sq_2.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
5	76cc463e-e34f-4d92-bf32-8a6cc42b15d0	3	1	Mini strawberry cupcake	Mini Berry	cupcake_sq_3.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
6	973c231e-c4a1-4c19-97f7-d3750c1676d8	3	1	Mini strawberry cupcake	Mini Berry	cupcake_sq_3.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
7	a59a127b-9f51-4ff2-a3a5-baa47fb3bc0d	4	1	Unicorn tear sparkling cupcake	Unicorn Tear	cupcake_sq_4.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
8	700175a6-1798-4e8e-96be-510c145b9f5c	4	1	Unicorn tear sparkling cupcake	Unicorn Tear	cupcake_sq_4.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
9	1df508af-d433-45c3-8c9f-f979b9958750	5	1	Red and yellow vanilla cupcake	Pearl Rose	cupcake_sq_5.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
10	abd4da98-fd7e-4f1a-b944-49c3640bbace	5	1	Red and yellow vanilla cupcake	Pearl Rose	cupcake_sq_5.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
11	11317b62-c53f-40c2-9f71-2f9f14ebcd0d	6	1	Silky red cupcake loaded with frosting	Red Silk	cupcake_sq_6.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
12	bfd3ac2d-b738-4825-8e37-4bb2190ad08d	6	1	Silky red cupcake loaded with frosting	Red Silk	cupcake_sq_6.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
13	a8ea46c3-e7e9-45b5-a7bf-52e9d17adfc5	7	1	Vanilla cupcake with vanilla frosting	Vanilla Stack Cake	cupcake_sq_7.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
14	91c7bf8a-7b99-4808-90d0-376a7e234554	7	1	Vanilla cupcake with vanilla frosting	Vanilla Stack Cake	cupcake_sq_7.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
15	cff9151d-559c-43c1-9d3e-17ff98a5fb8f	8	1	Blueberry cupcake piled high with toppings	Blueberry Malt Cake	cupcake_sq_8.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
16	2589b2df-65ae-40d1-8f92-5e4bf5d4d543	8	1	Blueberry cupcake piled high with toppings	Blueberry Malt Cake	cupcake_sq_8.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
17	bc6728f5-74c8-470d-a716-39afb3072d02	9	1	Lemon cupcake with piled high lemon frosting	Double Lemon	cupcake_sq_9.jpg	full_image	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
18	d19d32c7-74bb-4a73-9666-79b428da0df0	9	1	Lemon cupcake with piled high lemon frosting	Double Lemon	cupcake_sq_9.jpg	thumbnail	2020-02-09 00:11:22.195948+00	2020-02-09 00:11:22.195948+00	\N
\.


--
-- Data for Name: orderItems; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."orderItems" (id, pid, "productId", "orderId", each, quantity, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: orderStatuses; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."orderStatuses" (id, mid, name, description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	new	New	Order created but not submitted	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
2	pending	Pending	Order placed, pending processing from store	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
3	hold	On Hold	Order is on hold	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
4	shipped	Shipped	Order has been shipped to customer	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
5	canceled	Canceled	Order has been canceled	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
6	complete	Complete	Order is complete	2020-02-22 12:17:54.933818+00	2020-02-22 12:17:54.933818+00	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.orders (id, pid, "cartId", "guestId", "userId", "statusId", "itemCount", total, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.products (id, pid, "createdById", caption, cost, description, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	88f7a0b9-5897-4043-a735-81e3e9d91c19	1	Delicious Strawberry Cupcake	350	These strawberry delights will satisfy both your sweet tooth and those strawberry cravings.	Strawberry Delight	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
2	edcc0d97-f32d-4f0e-8638-dead1735f3ac	1	Sweet Berry Cupcake	200	This is the berry cupcake of your dreams, they may be small but pack huge flavor.	Purple Dream	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
3	eee68c03-0989-4516-816d-dbfa1928d7fa	1	Mini Strawberry Cupcake	225	These are a miniature version of our famous Strawberry Delight cupcakes, all the flavor, half the guilt.	Mini Berry	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
4	ae4032db-f913-4f49-b32a-c59cfacc5cc0	1	Unicorn Tear Sparkling Cupcake	650	What do unicorn tears taste like? We don't know, but we do know these cupcakes taste better!	Unicorn Tear	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
5	08f11817-98dc-4689-88ea-fdc803d203a4	1	Red and Yellow Rose Vanilla Cupcake	575	Delightful vanilla cupcakes with rose frosting piled high on top.	Pearl Rose	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
6	5572c901-33f8-4030-893d-98b1e1b1ccb2	1	Silky Red Cupcake Loaded with Frosting	350	A vanilla cupcake with strawberry silk frosting eloquently piled high with a peach topping.	Red Silk	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
7	f7719b89-d696-4605-9829-a41bb3b003af	1	Vanilla Cupcake Piled with Vanilla Frosting	600	Not just another vanilla cupcake. Our Vanilla Stack Cake cupcake is stacked with three scoops of vanilla frosting and topped with drizzled vanilla and a delicious cherry.	Vanilla Stack Cake	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
8	b72274c9-d86d-4df9-97c3-f9fafb58b007	1	Blueberry Cupcake Piled High with Toppings	775	A large blueberry cupcake topped with blueberry frosting, chocolate syrup, whip cream, and a sweet cherry. Looks and taste like your favorite blueberry malt.	Blueberry Malt Cake	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
9	76b7672b-0229-4edd-ade0-94fa46f927d9	1	Lemon Cupcake with Piled High Lemon Frosting	450	Lemon, lemon, and more lemon! Love lemon? So do we and our Double Lemon cupcake proves it!	Double Lemon	2020-02-16 22:39:00.143516+00	2020-02-16 22:39:00.143516+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.users (id, pid, "roleId", "firstName", "lastName", email, password, "lastAccessedAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	94c2bec7-a4bd-478f-b2a4-b557f609711c	1	test	test	test@example.com	$2b$10$x970eXvZh98SIsKMU1Q80u1IsNuvsrnDXSjGuyebRQRIf0c.tM9pK	2020-02-18 03:35:48.73376+00	2020-02-18 03:35:48.73376+00	2020-02-18 03:35:48.73376+00	\N
3	12b0b7cc-a61d-442a-ab4f-182714d99328	1	1	2	23@example.com	$2b$10$xS.hgoPjW7BjBBn7zuB1C.8/mCCH5QVo4.RtHpX6A3sIpzieBjeoO	2020-02-18 03:37:52.620164+00	2020-02-18 03:37:52.620164+00	2020-02-18 03:37:52.620164+00	\N
4	2fbeac11-b70a-40da-bf59-29f06d597e64	1	123	123	12323@example.com	$2b$10$gPNgYBu5Y5Xs51OVaXfok.g2rGx6AocPyyhb6fuRoonUGrIXwk2JW	2020-02-18 08:07:36.37665+00	2020-02-18 08:07:36.37665+00	2020-02-18 08:07:36.37665+00	\N
5	65fb274c-2df0-4e8e-9c61-6380b4ff8cf3	1	mia	zhang	miyawingz@gmail.com	$2b$10$qs2ooNFijq7XpSLJyshEQ.8XI68mDciszSgF4rzsDYn.AmBPvmZNm	2020-02-18 08:11:48.710087+00	2020-02-18 08:11:48.710087+00	2020-02-18 08:11:48.710087+00	\N
7	c1cc9288-1ea7-44c1-832e-e32a78baca32	1	456	456	456@example.com	$2b$10$BufGZp0FD2INoWoUfiXKrO89D4M/tVw6X/RSsEoBt5XMYgK5MlQ2q	2020-02-22 10:04:13.938588+00	2020-02-22 10:04:13.938588+00	2020-02-22 10:04:13.938588+00	\N
10	cb81c61b-6027-4448-a64b-6df0661e3539	1	789	789	789@example.com	$2b$10$yK1sTfznS5cmGqDDfEksAOUj09wcp2R0He57ICfH0EMsCzqBXk3e6	2020-02-22 10:46:39.748267+00	2020-02-22 10:46:39.748267+00	2020-02-22 10:46:39.748267+00	\N
11	13cb7453-e5a9-4212-af58-6b915576a942	1	123	123	123@example.com	$2b$10$1d3Q5BS.00noXf5PeFI8cOGcFYp.XfZs/DLjSaxMO.06Slp6HVDXO	2020-02-22 10:47:12.800956+00	2020-02-22 10:47:12.800956+00	2020-02-22 10:47:12.800956+00	\N
12	6e776514-853d-4062-8170-45d557d1333e	1	Jane	Doe	1@example.com	$2b$10$.a.cseRznsolAtrIYSrPl.XNO3CmnAmHDDpr618SLQiuJiHLy/NMW	2020-02-22 10:51:44.334878+00	2020-02-22 10:51:44.334878+00	2020-02-22 10:51:44.334878+00	\N
13	26ab448a-72b5-49c4-99fd-599d8de511e8	1	1	1	111@example.com	$2b$10$lO11uAdcSkiw4UeoifWasebdmRAtLnEtTpopAGu7q5vjXkNgAcuiC	2020-02-22 11:28:41.654776+00	2020-02-22 11:28:41.654776+00	2020-02-22 11:28:41.654776+00	\N
\.


--
-- Name: cartItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."cartItems_id_seq"', 38, true);


--
-- Name: cartStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."cartStatuses_id_seq"', 1, false);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.carts_id_seq', 8, true);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.images_id_seq', 1, false);


--
-- Name: orderItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."orderItems_id_seq"', 1, false);


--
-- Name: orderStatuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."orderStatuses_id_seq"', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: cartItems cartItems_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartItems"
    ADD CONSTRAINT "cartItems_pkey" PRIMARY KEY ("cartId", "productId");


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: orderStatuses orderStatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."orderStatuses"
    ADD CONSTRAINT "orderStatuses_pkey" PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_id_key; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_id_key UNIQUE (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id, pid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: cartItems cartItems_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartItems"
    ADD CONSTRAINT "cartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cartItems cartItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartItems"
    ADD CONSTRAINT "cartItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: orderItems orderItems_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."orderItems"
    ADD CONSTRAINT "orderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orderItems orderItems_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."orderItems"
    ADD CONSTRAINT "orderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: orders orders_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public.carts(id);


--
-- Name: orders orders_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."orderStatuses"(id);


--
-- PostgreSQL database dump complete
--

