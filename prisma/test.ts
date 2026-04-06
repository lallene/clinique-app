import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";


async function main() {
  console.log("🚀 Début du seeding de la base de données clinique...");

  // Nettoyage de la base (Optionnel mais recommandé pour éviter les doublons au seed)
  // L'ordre est important à cause des clés étrangères
  await prisma.logAudit.deleteMany({});
  await prisma.paiement.deleteMany({});
  await prisma.mvtPharmacie.deleteMany({});
  await prisma.examen.deleteMany({});
  await prisma.facture.deleteMany({});
  await prisma.rendezVous.deleteMany({});
  await prisma.hospitalisation.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.assurance.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.utilisateur.deleteMany({});

  // --- UTILISATEURS ---
  const roles = ["administrateur", "medecin", "infirmier", "caisse", "direction"];
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.utilisateur.create({
      data: {
        login: `staff_${i}_${faker.internet.username().toLowerCase()}`,
        mot_de_passe: "password123", // Mot de passe fixe pour vos tests
        nom: faker.person.lastName().toUpperCase(),
        prenom: faker.person.firstName(),
        role: roles[i % roles.length],
        actif: true,
      },
    });
    users.push(user);
  }

  // --- SERVICES ---
  const serviceNames = ["Consultation générale", "Urgences", "Pédiatrie", "Cardiologie", "Laboratoire"];
  const services = [];
  for (const name of serviceNames) {
    const service = await prisma.service.create({
      data: {
        nom_service: name,
        type_service: "Médical",
      },
    });
    services.push(service);
  }

  // --- ASSURANCES ---
  const assuranceNames = ["MUGEF-CI", "SAHAM", "ASCOMA", "GNA"];
  const assurances = [];
  for (const name of assuranceNames) {
    const assurance = await prisma.assurance.create({
      data: {
        nom: name,
        convention: faker.company.catchPhrase(),
        taux_couverture: faker.helpers.arrayElement([0.7, 0.8, 0.9, 1.0]),
        contact: faker.phone.number(),
      },
    });
    assurances.push(assurance);
  }

  // --- PATIENTS ---
  const patients = [];
  for (let i = 0; i < 15; i++) {
    const assurance = faker.helpers.arrayElement(assurances);
    const patient = await prisma.patient.create({
      data: {
        code_patient: `PAT-${Date.now()}-${i}`,
        nom: faker.person.lastName().toUpperCase(),
        prenom: faker.person.firstName(),
        sexe: faker.helpers.arrayElement(["M", "F"]),
        dateNaissance: faker.date.birthdate({ min: 0, max: 80, mode: "age" }),
        telephone: faker.phone.number(),
        adresse: faker.location.streetAddress(),
        numero_dossier: `DOS-${faker.string.alphanumeric(6).toUpperCase()}`,
        // Utilisation correcte du champ scalaire défini dans votre schéma
        assurance_id: assurance.id_assurance,
      },
    });
    patients.push(patient);
  }

  // --- CONSULTATIONS ---
  const medecins = users.filter(u => u.role === "medecin");
  const consultations = [];
  for (let i = 0; i < 20; i++) {
    const consultation = await prisma.consultation.create({
      data: {
        patient_id: faker.helpers.arrayElement(patients).id_patient,
        medecin_id: faker.helpers.arrayElement(medecins).id_user,
        service_id: faker.helpers.arrayElement(services).id_service,
        motif: "Consultation de routine : " + faker.lorem.words(3),
        constantes: "T°: 37.5, Tension: 12/8, Poids: 70kg",
        diagnostic: faker.lorem.sentence(),
        prescription: "Paracétamol 500mg, 1 matin/soir",
      },
    });
    consultations.push(consultation);
  }

  // --- HOSPITALISATIONS ---
  const hospitalisations = [];
  for (let i = 0; i < 5; i++) {
    const hospit = await prisma.hospitalisation.create({
      data: {
        patient_id: faker.helpers.arrayElement(patients).id_patient,
        medecin_responsable: faker.helpers.arrayElement(medecins).id_user,
        date_entree: faker.date.recent(),
        chambre: `CH-${faker.number.int({ min: 100, max: 200 })}`,
        lit: `L-${faker.number.int({ min: 1, max: 2 })}`,
        statut: "en_cours",
      },
    });
    hospitalisations.push(hospit);
  }

  // --- FACTURES & PAIEMENTS ---
  for (let i = 0; i < 12; i++) {
    const patient = faker.helpers.arrayElement(patients);
    const montantTotal = faker.number.float({ min: 15000, max: 250000, multipleOf: 5 });
    
    const facture = await prisma.facture.create({
      data: {
        numero_facture: `FAC-${new Date().getFullYear()}-${1000 + i}`,
        montant_total: montantTotal,
        montant_patient: montantTotal * 0.3, // Exemple 30% ticket modérateur
        montant_assurance: montantTotal * 0.7,
        patient_id: patient.id_patient,
        assurance_id: patient.assurance_id,
        statut: "payee",
        cree_par: faker.helpers.arrayElement(users.filter(u => u.role === "caisse")).id_user,
      },
    });

    await prisma.paiement.create({
      data: {
        facture_id: facture.id_facture,
        montant: facture.montant_patient || 0,
        mode_paiement: faker.helpers.arrayElement(["Espèces", "Orange Money", "Wave", "Carte"]),
      },
    });
  }

  // --- PRODUITS PHARMACIE ---
  const produits = [];
  const medicaments = ["Paracétamol", "Amoxicilline", "Ibuprofène", "Bétadine", "Sérum Salé"];
  for (const nom of medicaments) {
    const produit = await prisma.produitPharmacie.create({
      data: {
        code_produit: `MED-${faker.string.alphanumeric(4).toUpperCase()}`,
        nom_produit: nom,
        forme: faker.helpers.arrayElement(["Comprimé", "Sirop", "Injectable"]),
        prix_achat: faker.number.float({ min: 500, max: 2000 }),
        prix_vente: faker.number.float({ min: 2500, max: 5000 }),
        quantite_stock: faker.number.int({ min: 10, max: 100 }),
      },
    });
    produits.push(produit);
  }

  console.log("✅ Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });