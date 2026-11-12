# Plan d'Implémentation - Système de Gestion des Absences Étudiantes (Université)

Ce document présente l'architecture, la modélisation des données et la feuille de route pour le développement de l'application web full-stack de gestion des absences étudiantes, conformément aux spécifications du TP 3 (Méthodologie Agile - Scrum).

---

## 1. Contexte & Objectifs

L'objectif est de développer une plateforme web moderne, intuitive et réactive permettant à une université de gérer l'assiduité de ses étudiants selon 3 profils d'utilisateurs distincts :
- **Enseignants** : Saisie des absences, consultation des listes d'étudiants par groupe, validation des justificatifs, suivi des taux d'absence.
- **Étudiants** : Consultation de leur emploi du temps, historique des absences et statuts, soumission en ligne de justificatifs avec suivi du traitement.
- **Administrateurs** : Gestion globale des étudiants, enseignants, groupes de TD/TP, filières, et tableau de bord analytique des statistiques d'assiduité.

---

## 2. Stack Technique & Architecture

| Couche | Technologies | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18+ (Vite) + Tailwind CSS + Lucide Icons + Recharts | Interface réactive, moderne, typée et composants visuels de statistiques (KPIs, camemberts, barres de progression). |
| **Authentification** | Firebase Authentication | Prise en charge native de la connexion **Google Sign-In** et Email/Password, gestion sécurisée des sessions. |
| **Base de Données** | Cloud Firestore (NoSQL temps réel) | Synchronisation instantanée des présences/absences, structure flexible par documents/collections. |
| **Backend & Logique Métier** | Node.js / Express + Firebase Admin SDK & Client SDK | API REST modulaire pour les opérations d'administration, calculs analytiques et règles de sécurité Firestore. |
| **Gestion des Justificatifs** | Firebase Storage / Cloudinary ou encodage sécurisé Base64 | Téléversement et consultation des pièces justificatives (certificats médicaux, convocations officielles). |
| **Mode Hybride Démo** | Mode Simulation / Seed intégré | Données de démonstration prêtes à l'emploi permettant de tester immédiatement les 3 rôles (Admin, Enseignant, Étudiant) même avant la saisie des clés API Firebase. |

---

## 3. Modélisation des Données (Schéma Cloud Firestore)

### `users` (Collection)
```json
{
  "uid": "string (Firebase Auth UID)",
  "displayName": "string",
  "email": "string",
  "role": "admin | teacher | student",
  "photoURL": "string",
  "studentNumber": "string (ex: ETU-2026-0042, si étudiant)",
  "groupId": "string (référence au groupe TD/TP, si étudiant)",
  "department": "string (ex: Informatique)",
  "phone": "string",
  "createdAt": "timestamp"
}
```

### `groups` (Collection)
```json
{
  "id": "string (ex: GRP-L3-INFO-A)",
  "name": "string (ex: L3 Informatique - Groupe A)",
  "promotion": "string (ex: Licence 3)",
  "academicYear": "2025-2026",
  "department": "Informatique",
  "studentCount": "number"
}
```

### `courses` (Collection)
```json
{
  "id": "string",
  "code": "string (ex: INF301)",
  "title": "string (ex: Génie Logiciel & Méthodes Agiles)",
  "teacherId": "string (UID enseignant)",
  "teacherName": "string",
  "groupIds": ["string (IDs des groupes inscrits)"],
  "totalSessions": "number (ex: 24)"
}
```

### `timetables` (Collection - Emplois du temps)
```json
{
  "id": "string",
  "groupId": "string",
  "dayOfWeek": "1 | 2 | 3 | 4 | 5 | 6 (Lundi à Samedi)",
  "startTime": "08:30",
  "endTime": "10:30",
  "courseId": "string",
  "courseName": "string",
  "teacherName": "string",
  "room": "Salle B204 / Amphi A",
  "type": "CM | TD | TP"
}
```

### `absences` (Collection)
```json
{
  "id": "string",
  "studentId": "string (UID)",
  "studentName": "string",
  "studentNumber": "string",
  "groupId": "string",
  "groupName": "string",
  "courseId": "string",
  "courseName": "string",
  "teacherId": "string (UID enseignant ayant déclaré l'absence)",
  "teacherName": "string",
  "date": "YYYY-MM-DD",
  "timeSlot": "08:30 - 10:30",
  "status": "unjustified | pending_justification | justified | rejected",
  "reason": "string (optionnel)",
  "justificationId": "string (optionnel, lié au document justificatif)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `justifications` (Collection)
```json
{
  "id": "string",
  "absenceId": "string",
  "studentId": "string",
  "studentName": "string",
  "reason": "string (ex: Maladie, Urgence familiale, Transport)",
  "fileUrl": "string (URL document / attestation médicale)",
  "fileName": "string",
  "submittedAt": "timestamp",
  "status": "pending | approved | rejected",
  "reviewedBy": "string (UID enseignant ou admin)",
  "reviewedAt": "timestamp",
  "reviewComment": "string"
}
```

---

## 4. Spécification Détaillée des Fonctionnalités par Rôle

### 4.1. Module Enseignant (Professeur)
1. **Authentification** : Connexion via Google ou identifiants universitaires.
2. **Sélecteur de séance & groupe** : Choix de la matière, du groupe d'étudiants et de la date/créneau.
3. **Appel en ligne (Feuille d'émargement interactive)** :
   - Liste des étudiants du groupe avec photo, numéro étudiant et indicateur d'assiduité.
   - Saisie rapide en un clic : Présent / Absent / En retard / Excusé.
4. **Gestion des absences** :
   - Modification ou annulation d'une absence saisie par erreur.
   - Historique complet des absences par groupe et par cours avec recherche et filtres.
5. **Gestion des justificatifs & Taux d'absence** :
   - Traitement des justificatifs déposés par les étudiants (Valider en « Justifiée » ou Rejeter avec motif).
   - Calcul automatique et affichage du taux d'absence moyen du groupe et par étudiant individuel.

### 4.2. Module Étudiant
1. **Authentification** : Connexion via Google ou compte étudiant.
2. **Emploi du temps interactif** :
   - Vue hebdomadaire / journalière des cours, salles, professeurs et créneaux.
3. **Tableau de bord d'assiduité personnel** :
   - Résumé chiffré : Total d'absences, Nombre justifiées, Nombre non-justifiées, Taux global de présence.
   - Liste détaillée des absences avec statut coloré (Badge vert: Justifiée, Rouge: Injustifiée, Orange: En attente).
4. **Dépôt de justificatif** :
   - Formulaire dédié rattaché à une absence précise.
   - Choix du motif et téléversement du justificatif (PDF ou image).
   - Suivi en direct du statut (En attente d'examen, Validé, Refusé avec commentaire de l'enseignant).

### 4.3. Module Administrateur
1. **Gestion des Utilisateurs & Rôles** :
   - Ajout d'étudiants (nom, email, filière, groupe TD, matricule).
   - Modification et mise à jour des fiches étudiantes.
   - Ajout d'enseignants et affectation de matières.
2. **Gestion des Groupes & Filières** :
   - Création de promotions et groupes (ex: L1, L2, L3, M1, M2).
   - Affectation d'étudiants aux groupes.
3. **Tableau de bord Analytique & Statistiques d'absence** :
   - Graphique de répartition des absences par groupe et par département.
   - Taux d'absentéisme global de l'université sur la période.
   - Liste des étudiants en situation critique (dépassement du seuil toléré, ex: > 3 absences non justifiées).
   - Export des données (CSV / Impression de rapport).

---

## 5. Architecture de l'Application & Structure des Fichiers

L'application sera créée dans un répertoire dédié `univ-absence-app/` pour garantir l'isolation et la propreté du projet :

```
univ-absence-app/
├── public/                     # Assets statiques & icônes
├── src/
│   ├── assets/                 # Images & logos universitaires
│   ├── components/             # Composants réutilisables
│   │   ├── common/             # Navbar, Sidebar, StatCard, Badge, Modal, Alert
│   │   ├── auth/               # Modal de connexion, sélecteur rapide de rôle (Mode Démo)
│   │   ├── teacher/            # Feuille d'appel, Liste étudiants, Validation justificatifs
│   │   ├── student/            # Emploi du temps, Mes absences, Formulaire de justificatif
│   │   └── admin/              # CRUD étudiants/profs, Gestion des groupes, Tableaux analytiques
│   ├── context/                # AuthContext (Firebase Auth + rôle), AbsenceContext
│   ├── services/               # Configuration Firebase & Services Firestore
│   │   ├── firebase.js         # Initialisation Firebase Auth & Firestore
│   │   ├── authService.js      # Méthodes Google Sign-In, Logout, Switcher de rôle
│   │   ├── absenceService.js   # CRUD Firestore pour absences & justificatifs
│   │   ├── groupService.js     # Gestion des groupes & étudiants
│   │   └── mockData.js         # Données d'exemple pré-chargées pour démo immédiate
│   ├── pages/                  # Pages principales
│   │   ├── LoginPage.jsx       # Page de connexion Google / Email
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx                 # Routage protégé par rôle
│   ├── index.css               # Configuration Tailwind CSS
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md                   # Guide d'installation et de déploiement
```

---

## 6. Sprints de Réalisation (Méthodologie Scrum - TP3)

### **Sprint 1 : Socle Technique & Authentification Multi-Rôles**
- Initialisation du projet React + Vite + Tailwind CSS.
- Configuration du service Firebase (Authentication avec Google Provider + Firestore).
- Mise en place du module `AuthContext` avec détection automatique du rôle (Enseignant / Étudiant / Admin) et sélecteur de démonstration instantané.
- Implémentation du système de navigation sécurisé (Protected Routes).

### **Sprint 2 : Espace Enseignant (Appel, Saisie, Historique & Taux)**
- Écran de sélection : Groupe, Matière, Date et Créneau horaire.
- Composant « Feuille d'appel interactive » permettant de marquer les étudiants présents/absents/en retard en 1 clic.
- Écran d'historique des absences avec filtre par étudiant et calcul dynamique du taux d'absence individuel.
- Interface de révision et validation/rejet des justificatifs d'absence.

### **Sprint 3 : Espace Étudiant (Emploi du temps & Dépôt de justificatif)**
- Module interactif d'emploi du temps hebdomadaire avec affichage des matières, salles et horaires.
- Liste personnalisée des absences de l'étudiant avec badge de statut clair.
- Modal de dépôt de justificatif (motif, téléversement de pièce jointe / certificat médical).
- Consultation en temps réel de l'état de traitement du justificatif avec commentaires.

### **Sprint 4 : Espace Administrateur & Dashboard Statistiques**
- Interface de gestion des étudiants (ajout, édition, affectation aux groupes).
- Interface de gestion des enseignants et des groupes de TD/TP.
- Dashboard statistique global avec graphiques interactifs (Recharts) :
  - Taux d'absence par groupe et filière.
  - Évolution des absences par semaine / mois.
  - Alerte rouge pour les étudiants dépassant le quota d'absences autorisées.
- Données de démonstration prêtes à l'emploi (mock data & seeding Firestore).

---

## 7. Plan de Vérification & Critères d'Acceptation

1. **Vérification de l'authentification** :
   - Connexion réussie avec Google Auth.
   - Redirection automatique vers le tableau de bord approprié selon le rôle (`/teacher`, `/student`, `/admin`).
2. **Vérification du rôle Enseignant** :
   - Saisie d'une absence pour un groupe donné -> vérification de son enregistrement dans Firestore.
   - Modification d'une absence existante et vérification de la mise à jour immédiate du taux d'absence.
3. **Vérification du rôle Étudiant** :
   - Consultation de l'emploi du temps conforme au groupe de l'étudiant.
   - Soumission d'un justificatif et constat du passage au statut « En attente ».
4. **Vérification du rôle Admin** :
   - Création d'un nouvel étudiant et affectation à un groupe.
   - Vérification du bon calcul et de l'affichage des graphiques statistiques d'assiduité.
