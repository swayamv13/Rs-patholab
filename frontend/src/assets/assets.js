import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import drlal from './drlal.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import lab from './lab.webp'
import xray from './xray.webp'
import cbc from './cbc.webp'
import mri from './mri.jpeg'
import ultra from './ultra.jpeg'
import Package from './package.jpeg'
import Heart from './heart.webp'
import HighFever from './High_fever.webp'
import vitamind from './vitamin-d.webp'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    drlal,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon
}

export const specialityData = [
    {
        speciality: 'Blood Tests',
        image: cbc,
        slug: "blood-tests"
    },
    {
        speciality: 'High Fever',
        image: HighFever,
        slug: "high-fever"
    },
    {
        speciality: 'Ultrasound',
        image: Gynecologist,
        name: "Ultrasound",
        slug: "ultrasound"
    },
    {
        speciality: 'X-ray Services',
        image: xray,
        name: "X-ray",
        slug: "x-ray",
    },
    {
        speciality: 'Heart',
        image: Heart,
        slug: "heart"
    },
    {
        speciality: 'Vitamin-D',
        image: vitamind,
        slug: "vitamin-d"
    },
    {
        speciality: 'Urine & Stool',
        image: lab,
        slug: 'urine-stool'
    },
    {
        speciality: 'Thyroid & Diabetes',
        image: vitamind,
        slug: 'thyroid-diabetes'
    },
    {
        speciality: 'Liver & Kidney',
        image: cbc,
        slug: 'liver-kidney'
    },
    {
        speciality: 'Infection & Dengue',
        image: HighFever,
        slug: 'infection'
    },
    {
        speciality: 'MRI & CT Scan',
        image: mri,
        slug: 'mri-ct'
    },
    {
        speciality: "Women's Health",
        image: Gynecologist,
        slug: 'womens-health'
    },
    {
        speciality: "Men's Health",
        image: General_physician,
        slug: 'mens-health'
    },
    {
        speciality: 'Preventive Packages',
        image: Package,
        slug: 'preventive-packages'
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]

export const healthPackages = [
    {
        id: "T101",
        name: "SWASTHFIT SUPER 1-NEW",
        originalPrice: 2570,
        discountedPrice: 1900.00,
        discount: 47,
        details: [
            "Overnight fasting preferred. Duly filled ASCVD form (Form 59) is mandatory for ...Read more",
            "Daily",
            "34 parameter(s) covered"
        ],
        categorySlug: "blood-tests",
        link: "/packages/swasthfit-super-1"
    },
    {
        id: "T102",
        name: "FULL BODY SCAN (MRI & CT)",
        originalPrice: 15500,
        discountedPrice: 12400.00,
        discount: 20,
        details: [
            "Includes 3 essential scans: MRI Head, CT Chest, and Abdominal Ultrasound.",
            "Appointment required (Book 24hrs in advance)",
            "3 Comprehensive scans covered"
        ],
        categorySlug: "x-ray",
        link: "/packages/full-body-scan"
    },
    {
        id: "T103",
        name: "BASIC BLOOD WORKUP",
        originalPrice: 1150,
        discountedPrice: 899.00,
        discount: 22,
        details: [
            "Includes CBC, Liver Function Test (LFT), and Kidney Function Test (KFT).",
            "Daily (Fasting 10-12 hours required)",
            "15 important parameter(s) covered"
        ],
        categorySlug: "blood-tests",
        link: "/packages/basic-blood-workup"
    },
    {
        id: "T104",
        name: "COMPLETE BLOOD COUNT; CBC",
        originalPrice: 700,
        discountedPrice: 350.00,
        discount: 50,
        details: ["Overnight fasting preferred", "Daily", "20 Parameter(s) Covered"],
        categorySlug: "blood-tests",
        link: "/packages/cbc"
    },
    {
        id: "T105",
        name: "HbA1c; GLYCOSYLATED HEMOGLOBIN",
        originalPrice: 600,
        discountedPrice: 440.00,
        discount: 26,
        details: ["Fasting required", "Daily", "2 Parameter(s) Covered"],
        categorySlug: "blood-tests",
        link: "/packages/hba1c"
    },
    {
        id: "T106",
        name: "KIDNEY PANEL; KFT",
        originalPrice: 850,
        discountedPrice: 850.00,
        discount: 0,
        details: ["Daily", "Fasting", "16 Parameter(s) Covered"],
        categorySlug: "blood-tests",
        link: "/packages/kft"
    },
    {
        id: "T107",
        name: "LIPID PROFILE, BASIC",
        originalPrice: 1000,
        discountedPrice: 700.00,
        discount: 30,
        details: ["Fasting 12 hrs", "Daily", "6 Parameter(s) Covered"],
        categorySlug: "heart",
        link: "/packages/lipid-basic"
    },
    {
        id: "T108",
        name: "GLUCOSE, FASTING (F)",
        originalPrice: 80,
        discountedPrice: 80.00,
        discount: 0,
        details: ["Fasting 8 hrs", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "blood-tests",
        link: "/packages/glucose-f"
    },
    {
        id: "T109",
        name: "DENGUE NS1 ANTIGEN",
        originalPrice: 750,
        discountedPrice: 600.00,
        discount: 20,
        details: ["Fever Profile", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "high-fever",
        link: "/packages/dengue-ns1"
    },
    {
        id: "T110",
        name: "MALARIA PARASITE SMEAR",
        originalPrice: 130,
        discountedPrice: 100.00,
        discount: 23,
        details: ["Blood smear", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "high-fever",
        link: "/packages/malaria-parasite"
    },
    {
        id: "T111",
        name: "WIDAL TEST (TYPHOID)",
        originalPrice: 300,
        discountedPrice: 250.00,
        discount: 16,
        details: ["Serum Test", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "high-fever",
        link: "/packages/widal"
    },
    {
        id: "T112",
        name: "VITAMIN D TOTAL",
        originalPrice: 1450,
        discountedPrice: 999.00,
        discount: 31,
        details: ["Serum Test", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "vitamin-d",
        link: "/packages/vitamin-d"
    },
    {
        id: "T113",
        name: "CALCIUM TOTAL",
        originalPrice: 250,
        discountedPrice: 199.00,
        discount: 20,
        details: ["Bone Health", "Daily", "1 Parameter(s) Covered"],
        categorySlug: "vitamin-d",
        link: "/packages/calcium"
    },
    {
        id: "T114",
        name: "CHEST X-RAY PA VIEW",
        originalPrice: 600,
        discountedPrice: 400.00,
        discount: 33,
        details: ["Radiology", "Daily", "1 Scan"],
        categorySlug: "x-ray",
        link: "/packages/chest-xray"
    },
    {
        id: "T115",
        name: "USG ABDOMEN & PELVIS",
        originalPrice: 1800,
        discountedPrice: 1500.00,
        discount: 16,
        details: ["Ultrasound", "Appointment Required", "1 Scan"],
        categorySlug: "ultrasound",
        link: "/packages/usg-abdomen"
    },
    {
        id: "T116",
        name: "ECG (ELECTROCARDIOGRAM)",
        originalPrice: 350,
        discountedPrice: 300.00,
        discount: 14,
        details: ["Heart Check", "Daily", "1 Test"],
        categorySlug: "heart",
        link: "/packages/ecg"
    },
    {
        id: "T117",
        name: "CARDIAC MARKERS (TROP-I)",
        originalPrice: 1200,
        discountedPrice: 1000.00,
        discount: 16,
        details: ["Blood Test", "Daily", "Cardiac Safety"],
        categorySlug: "heart",
        link: "/packages/cardiac-markers"
    },
    {
        id: "T118",
        name: "THYROID PROFILE (T3, T4, TSH)",
        originalPrice: 550,
        discountedPrice: 450.00,
        discount: 18,
        details: ["Hormone Test", "Daily", "3 Parameters"],
        categorySlug: "blood-tests",
        link: "/packages/thyroid-profile"
    },
    {
        id: "T119",
        name: "COVID-19 RT-PCR",
        originalPrice: 900,
        discountedPrice: 600.00,
        discount: 33,
        details: ["Nasal Swab", "Daily", "Result in 24hr"],
        categorySlug: "high-fever",
        link: "/packages/covid"
    },
    {
        id: "T120",
        name: "USG KUB (KIDNEY, URETER, BLADDER)",
        originalPrice: 1200,
        discountedPrice: 1000.00,
        discount: 16,
        details: ["Ultrasound", "Appointment Required", "Detailed Scan"],
        categorySlug: "ultrasound",
        link: "/packages/usg-kub"
    }
];

export const testCategories = [
    { name: "ABO Incompatibility", slug: "abo-incompatibility" },
    { name: "Acid Base Imbalance", slug: "acid-base-imbalance" },
    { name: "Acute Phase Reactant", slug: "acute-phase-reactant" },
];