import { useEffect, useMemo, useState } from "react";

type Expression = {
  group: string;
  expression: string;
  meaning: string;
  example: string;
  exampleFrench: string;
};

const groupTitles: Record<string, string> = {
  "EVERYDAY": "Les incontournables du quotidien",
  "REACTIONS": "Pour réagir, encourager ou donner son avis",
  "IDIOMS": "Expressions idiomatiques et imagées",
  "FEELINGS": "Sentiments, états d'esprit et situations compliquées",
  "PRACTICAL": "Expressions pratiques au travail ou en conversation",
};

const expressions: Expression[] = [
  // PART 1: EVERYDAY
  { group: "EVERYDAY", expression: "What's up?", meaning: "Quoi de neuf? / Ça va?", example: "Hey bro, what's up?", exampleFrench: "Salut, ça va?" },
  { group: "EVERYDAY", expression: "How's it going?", meaning: "Comment ça va?", example: "Long time no see! How's it going?", exampleFrench: "Ça fait longtemps! Comment ça va?" },
  { group: "EVERYDAY", expression: "Never mind", meaning: "Laisse tomber / Ça ne fait rien", example: "Oh, never mind, I found my keys.", exampleFrench: "Oh, laisse tomber, j'ai trouvé mes clés." },
  { group: "EVERYDAY", expression: "You're welcome", meaning: "De rien / Je t'en prie", example: "Thanks for the help! - You're welcome.", exampleFrench: "Merci pour l'aide! - De rien." },
  { group: "EVERYDAY", expression: "Make yourself at home", meaning: "Fais comme chez toi", example: "Come in, sit down, and make yourself at home.", exampleFrench: "Rentre, assieds-toi, et fais comme chez toi." },
  { group: "EVERYDAY", expression: "Help yourself", meaning: "Sers-toi / Servez-vous", example: "There's plenty of food, please help yourself!", exampleFrench: "Il y a plein de nourriture, sers-toi!" },
  { group: "EVERYDAY", expression: "Take care", meaning: "Prends soin de toi / Prends garde", example: "See you next week. Take care!", exampleFrench: "À la semaine prochaine. Prends soin de toi!" },
  { group: "EVERYDAY", expression: "Have a good one", meaning: "Passe une bonne journée/soirée", example: "Thanks for shopping with us, have a good one!", exampleFrench: "Merci de vos achats, passez une bonne journée!" },
  { group: "EVERYDAY", expression: "Long time no see", meaning: "Ça fait un bail / Ça fait longtemps qu'on ne s'est pas vus", example: "Hey Sarah! Long time no see.", exampleFrench: "Salut Sarah! Ça fait longtemps!" },
  { group: "EVERYDAY", expression: "It's up to you", meaning: "C'est toi qui décides / C'est entre tes mains", example: "We can eat pizza or sushi, it's up to you.", exampleFrench: "On peut manger de la pizza ou des sushis, c'est toi qui décides." },
  { group: "EVERYDAY", expression: "I have no idea", meaning: "Je n'en ai aucune idée", example: "Where is the station? - I have no idea.", exampleFrench: "Où est la gare? - Je n'en ai aucune idée." },
  { group: "EVERYDAY", expression: "As soon as possible (ASAP)", meaning: "Dès que possible / Le plus vite possible", example: "Please call me back ASAP.", exampleFrench: "Rappelle-moi dès que possible." },
  { group: "EVERYDAY", expression: "By the way", meaning: "Au fait / À propos", example: "By the way, I saw your brother yesterday.", exampleFrench: "Au fait, j'ai vu ton frère hier." },
  { group: "EVERYDAY", expression: "Keep in touch", meaning: "On reste en contact", example: "Goodbye! Let's keep in touch.", exampleFrench: "Au revoir! On reste en contact." },
  { group: "EVERYDAY", expression: "Suit yourself", meaning: "Fais comme tu veux / À ta guise", example: "You don't want to come? Suit yourself!", exampleFrench: "Tu ne veux pas venir? Fais comme tu veux!" },
  { group: "EVERYDAY", expression: "I don't care", meaning: "Je m'en fiche / Ça m'est égal", example: "Rain or shine, I don't care, I'm going out.", exampleFrench: "Pluie ou soleil, je m'en fiche, je sors." },
  { group: "EVERYDAY", expression: "It doesn't matter", meaning: "Ce n'est pas important / Peu importe", example: "I lost my pen, but it doesn't matter, I have another one.", exampleFrench: "J'ai perdu mon stylo, mais peu importe, j'en ai un autre." },
  { group: "EVERYDAY", expression: "Are you kidding me?", meaning: "Tu plaisantes? / Tu te moques de moi?", example: "You won the lottery? Are you kidding me?", exampleFrench: "Tu as gagné à la loterie? Sans blague?" },
  { group: "EVERYDAY", expression: "So far, so good", meaning: "Jusqu'ici, tout va bien", example: "How is your new job? - So far, so good.", exampleFrench: "Comment va ton nouveau travail? - Jusqu'ici, tout va bien." },
  { group: "EVERYDAY", expression: "No worries", meaning: "Pas de problème / Pas de soucis", example: "Thanks for the ride! - No worries, mate.", exampleFrench: "Merci pour la balade! - Pas de souci, mon pote." },

  // PART 2: REACTIONS
  { group: "REACTIONS", expression: "My bad", meaning: "C'est ma faute / Au temps pour moi", example: "I forgot to buy milk. My bad!", exampleFrench: "J'ai oublié d'acheter du lait. C'est de ma faute!" },
  { group: "REACTIONS", expression: "Fingers crossed!", meaning: "On croise les doigts!", example: "Your exam is tomorrow? Fingers crossed!", exampleFrench: "Ton examen est demain? On croise les doigts!" },
  { group: "REACTIONS", expression: "Break a leg!", meaning: "Bonne chance! (avant d'entrer sur scène)", example: "You're going on stage? Break a leg!", exampleFrench: "Tu montes sur scène? Bonne chance!" },
  { group: "REACTIONS", expression: "Cheer up!", meaning: "Reprends courage! / Garde le sourire!", example: "Cheer up! It's not the end of the world.", exampleFrench: "Reprends courage! Ce n'est pas la fin du monde." },
  { group: "REACTIONS", expression: "Keep it up!", meaning: "Continue comme ça!", example: "Your English is getting better. Keep it up!", exampleFrench: "Ton anglais s'améliore. Continue comme ça!" },
  { group: "REACTIONS", expression: "Good for you!", meaning: "Tant mieux pour toi! / Bravo!", example: "I got a promotion! - Good for you!", exampleFrench: "J'ai eu une promotion! - Tant mieux pour toi!" },
  { group: "REACTIONS", expression: "I'm proud of you", meaning: "Je suis fier de toi", example: "You passed the test, I'm proud of you.", exampleFrench: "Tu as réussi le test, je suis fier de toi." },
  { group: "REACTIONS", expression: "That's a good point", meaning: "C'est un bon argument / Tu marques un point", example: "I hadn't thought of that, that's a good point.", exampleFrench: "Je n'y avais pas pensé, c'est un bon argument." },
  { group: "REACTIONS", expression: "Tell me about it!", meaning: "Tu m'en diras tant! / Je le sais bien!", example: "Public transport is so slow today. - Tell me about it!", exampleFrench: "Les transports en commun sont lents aujourd'hui. - Tu me l'dis!" },
  { group: "REACTIONS", expression: "I couldn't care less", meaning: "Je m'en fous royalement", example: "What he thinks of me? I couldn't care less.", exampleFrench: "Ce qu'il pense de moi? Je m'en fous royalement." },
  { group: "REACTIONS", expression: "Beats me!", meaning: "Aucune idée! / Ça me dépasse!", example: "Why is the door locked? - Beats me!", exampleFrench: "Pourquoi la porte est fermée? - Aucune idée!" },
  { group: "REACTIONS", expression: "You can say that again!", meaning: "Tu l'as dit! / Je suis d'accord!", example: "This movie is terrible. - You can say that again!", exampleFrench: "Ce film est horrible. - Et comment!" },
  { group: "REACTIONS", expression: "Fair enough", meaning: "C'est de bonne guerre / D'accord", example: "I can't come because I have to work. - Fair enough.", exampleFrench: "Je ne peux pas venir parce que je dois travailler. - D'accord." },
  { group: "REACTIONS", expression: "No way!", meaning: "Pas question! / C'est pas vrai!", example: "He quit his job? No way!", exampleFrench: "Il a quitté son travail? Sans blague!" },
  { group: "REACTIONS", expression: "I'm easy", meaning: "Ça m'est égal / Je m'adapte", example: "Do you want to watch a comedy or a thriller? - I'm easy.", exampleFrench: "Tu veux regarder une comédie ou un thriller? - Ça m'est égal." },
  { group: "REACTIONS", expression: "I guess so", meaning: "Je suppose / Je crois bien", example: "Is it going to rain? - I guess so.", exampleFrench: "Est-ce qu'il va pleuvoir? - Je suppose." },
  { group: "REACTIONS", expression: "Think outside the box", meaning: "Être créatif / Sortir des sentiers battus", example: "To solve this problem, we need to think outside the box.", exampleFrench: "Pour résoudre ce problème, nous devons être créatifs." },
  { group: "REACTIONS", expression: "Point taken", meaning: "J'ai compris l'argument", example: "Okay, point taken, I'll stop arguing.", exampleFrench: "D'accord, j'ai compris, j'arrête de discuter." },
  { group: "REACTIONS", expression: "I'm all ears", meaning: "Je suis tout ouïe / Je t'écoute", example: "Tell me your secret, I'm all ears.", exampleFrench: "Raconte-moi ton secret, je t'écoute." },
  { group: "REACTIONS", expression: "Count me in!", meaning: "Compte sur moi! / J'en suis!", example: "Who wants to go to the beach? - Count me in!", exampleFrench: "Qui veut aller à la plage? - Je suis partant!" },

  // PART 3: IDIOMS
  { group: "IDIOMS", expression: "A piece of cake", meaning: "Un jeu d'enfant / C'est simple", example: "Don't worry, the exam was a piece of cake.", exampleFrench: "Ne t'inquiète pas, l'examen était facile." },
  { group: "IDIOMS", expression: "Once in a blue moon", meaning: "Très rarement / Tous les trente du mois", example: "He goes to the gym once in a blue moon.", exampleFrench: "Il va à la gym très rarement." },
  { group: "IDIOMS", expression: "Cost an arm and a leg", meaning: "Coûter les yeux de la tête", example: "This new phone costs an arm and a leg.", exampleFrench: "Ce nouveau téléphone coûte extrêmement cher." },
  { group: "IDIOMS", expression: "Under the weather", meaning: "Ne pas être dans son assiette / Être malade", example: "I'm not coming today, I'm feeling a bit under the weather.", exampleFrench: "Je ne viens pas aujourd'hui, je me sens pas très bien." },
  { group: "IDIOMS", expression: "Bite the bullet", meaning: "Prendre son courage à deux mains", example: "I have to go to the dentist. I'll just bite the bullet.", exampleFrench: "Je dois aller chez le dentiste. Je vais me lancer." },
  { group: "IDIOMS", expression: "Spill the beans", meaning: "Vendre la mèche / Cracher le morceau", example: "Come on, spill the beans! Who is your new boyfriend?", exampleFrench: "Allez, dis-moi! Qui est ton nouveau copain?" },
  { group: "IDIOMS", expression: "Break the ice", meaning: "Briser la glace", example: "He told a joke to break the ice.", exampleFrench: "Il a raconté une blague pour briser la glace." },
  { group: "IDIOMS", expression: "Let the cat out of the bag", meaning: "Vendre la mèche / Révéler un secret", example: "It was a surprise party, but John let the cat out of the bag.", exampleFrench: "C'était une fête surprise, mais Jean a vendu la mèche." },
  { group: "IDIOMS", expression: "Pull someone's leg", meaning: "Faire marcher quelqu'un / Faire une blague", example: "Are you really moving to Japan? - No, I'm just pulling your leg!", exampleFrench: "Tu déménages vraiment au Japon? - Non, je plaisante!" },
  { group: "IDIOMS", expression: "Hit the sack", meaning: "Aller au lit / Se coucher", example: "I'm exhausted, I'm going to hit the sack.", exampleFrench: "Je suis épuisé, je vais me coucher." },
  { group: "IDIOMS", expression: "Face the music", meaning: "Assumer les conséquences", example: "I broke the window, now I have to face the music.", exampleFrench: "J'ai cassé la vitre, maintenant je dois en assumer les conséquences." },
  { group: "IDIOMS", expression: "Hit the nail on the head", meaning: "Mettre le doigt sur le problème", example: "Your analysis is exact. You hit the nail on the head.", exampleFrench: "Ton analyse est juste. Tu as mis le doigt sur le problème." },
  { group: "IDIOMS", expression: "Burn the midnight oil", meaning: "Travailler tard la nuit", example: "I have a big exam tomorrow, I need to burn the midnight oil.", exampleFrench: "J'ai un gros examen demain, je dois travailler tard." },
  { group: "IDIOMS", expression: "Call it a day", meaning: "S'arrêter là pour aujourd'hui", example: "We've been working for 8 hours. Let's call it a day.", exampleFrench: "On travaille depuis 8 heures. On s'arrête ici." },
  { group: "IDIOMS", expression: "The elephant in the room", meaning: "Le sujet tabou / Le problème évident", example: "Nobody mentioned his bankruptcy; it was the elephant in the room.", exampleFrench: "Personne n'a mentionné sa faillite; c'était le problème évident." },
  { group: "IDIOMS", expression: "Cold feet", meaning: "Avoir la frousse / Reculer", example: "He got cold feet and cancelled the wedding.", exampleFrench: "Il a eu peur et a annulé le mariage." },
  { group: "IDIOMS", expression: "Cut corners", meaning: "Travailler à l'économie / Bâcler", example: "The builders cut corners, and now the roof is leaking.", exampleFrench: "Les constructeurs ont bâclé le travail, et maintenant le toit fuit." },
  { group: "IDIOMS", expression: "Through thick and thin", meaning: "Contre vents et marées", example: "Best friends stay together through thick and thin.", exampleFrench: "Les meilleurs amis restent ensemble quoi qu'il arrive." },
  { group: "IDIOMS", expression: "Cry over spilled milk", meaning: "Regretter le passé / Pleurer sur ce qui est fait", example: "It's broken now. Don't cry over spilled milk.", exampleFrench: "C'est cassé maintenant. N'aie pas de regrets." },
  { group: "IDIOMS", expression: "Catch someone red-handed", meaning: "Prendre quelqu'un la main dans le sac", example: "The security guard caught the thief red-handed.", exampleFrench: "Le gardien de sécurité a attrapé le voleur en flagrant délit." },

  // PART 4: FEELINGS
  { group: "FEELINGS", expression: "I'm on cloud nine", meaning: "Je suis aux anges / Sur un petit nuage", example: "Since she accepted my proposal, I'm on cloud nine.", exampleFrench: "Depuis qu'elle a accepté ma demande, je suis aux anges." },
  { group: "FEELINGS", expression: "Drive someone crazy", meaning: "Rendre quelqu'un fou", example: "That constant noise is driving me crazy!", exampleFrench: "Ce bruit constant me rend fou!" },
  { group: "FEELINGS", expression: "Raining cats and dogs", meaning: "Pleuvoir des cordes", example: "Take an umbrella, it's raining cats and dogs outside.", exampleFrench: "Prends un parapluie, il pleut des cordes dehors." },
  { group: "FEELINGS", expression: "Cut a long story short", meaning: "Pour faire court / Bref", example: "To cut a long story short, we got lost and missed the train.", exampleFrench: "Pour faire court, on s'est perdu et on a raté le train." },
  { group: "FEELINGS", expression: "Better late than never", meaning: "Mieux vaut tard que jamais", example: "Here is your birthday gift! - Thanks, better late than never.", exampleFrench: "Voilà ton cadeau d'anniversaire! - Merci, mieux vaut tard que jamais." },
  { group: "FEELINGS", expression: "Up in the air", meaning: "Rien n'est encore décidé / C'est en suspens", example: "Our holiday plans are still up in the air.", exampleFrench: "Nos plans de vacances sont encore en suspens." },
  { group: "FEELINGS", expression: "Ring a bell", meaning: "Dire quelque chose / Rappeler quelque chose", example: "Does the name 'John Smith' ring a bell to you?", exampleFrench: "Le nom 'John Smith' te dit quelque chose?" },
  { group: "FEELINGS", expression: "Keep an eye on", meaning: "Garder un œil sur / Surveiller", example: "Can you keep an eye on my bag for a minute?", exampleFrench: "Tu peux garder un œil sur mon sac une minute?" },
  { group: "FEELINGS", expression: "In the nick of time", meaning: "Juste à temps / Au dernier moment", example: "The ambulance arrived in the nick of time.", exampleFrench: "L'ambulance est arrivée juste à temps." },
  { group: "FEELINGS", expression: "Face to face", meaning: "En tête-à-tête / Face à face", example: "We need to discuss this face to face.", exampleFrench: "On doit en discuter face à face." },
  { group: "FEELINGS", expression: "On the tip of my tongue", meaning: "Sur le bout de la langue", example: "His name is on the tip of my tongue, but I can't remember it!", exampleFrench: "Son nom est sur le bout de ma langue, mais je ne m'en souviens pas!" },
  { group: "FEELINGS", expression: "Head over heels (in love)", meaning: "Éperdument amoureux", example: "They are head over heels in love with each other.", exampleFrench: "Ils sont éperdument amoureux l'un de l'autre." },
  { group: "FEELINGS", expression: "Out of the blue", meaning: "Sorti de nulle part / À l'improviste", example: "He called me out of the blue after five years.", exampleFrench: "Il m'a appelé de nulle part après cinq ans." },
  { group: "FEELINGS", expression: "Take it easy", meaning: "Relax / Ne te prends pas la tête", example: "Take it easy, there's no reason to be angry.", exampleFrench: "Relax, il n'y a pas de raison d'être en colère." },
  { group: "FEELINGS", expression: "Sleep on it", meaning: "La nuit porte conseil", example: "Don't decide now, sleep on it.", exampleFrench: "Ne décide pas maintenant, dors dessus." },
  { group: "FEELINGS", expression: "Read between the lines", meaning: "Lire entre les lignes", example: "If you read between the lines, you'll see he isn't happy.", exampleFrench: "Si tu lis entre les lignes, tu verras qu'il n'est pas heureux." },
  { group: "FEELINGS", expression: "Play it by ear", meaning: "Improviser / Aviser selon la situation", example: "We don't have a plan for tonight, let's play it by ear.", exampleFrench: "On n'a pas de plan pour ce soir, on verra bien." },
  { group: "FEELINGS", expression: "Lose one's temper", meaning: "Perdre son sang-froid / S'emporter", example: "He lost his temper when he heard the bad news.", exampleFrench: "Il a perdu son sang-froid en apprenant la mauvaise nouvelle." },
  { group: "FEELINGS", expression: "At the end of the day", meaning: "En fin de compte / Au bout du compte", example: "At the end of the day, it's your choice.", exampleFrench: "Au bout du compte, c'est ton choix." },
  { group: "FEELINGS", expression: "Down to earth", meaning: "Avoir les pieds sur terre / Être réaliste", example: "Despite being a famous actor, he is very down to earth.", exampleFrench: "Malgré sa célébrité, il a les pieds sur terre." },

  // PART 5: PRACTICAL
  { group: "PRACTICAL", expression: "Long story short", meaning: "Pour faire court", example: "Long story short, we bought the house.", exampleFrench: "Pour faire court, on a acheté la maison." },
  { group: "PRACTICAL", expression: "To make matters worse", meaning: "Pour ne rien arranger / Pour couronner le tout", example: "It started raining, and to make matters worse, I forgot my keys.", exampleFrench: "Il a commencé à pleuvoir, et en plus, j'ai oublié mes clés." },
  { group: "PRACTICAL", expression: "Get down to business", meaning: "Passer aux choses sérieuses", example: "Stop chatting and let's get down to business.", exampleFrench: "Arrêtez de discuter et passons aux choses sérieuses." },
  { group: "PRACTICAL", expression: "In my shoes", meaning: "À ma place", example: "What would you do if you were in my shoes?", exampleFrench: "Qu'est-ce que tu ferais à ma place?" },
  { group: "PRACTICAL", expression: "Take something for granted", meaning: "Prendre quelque chose pour acquis", example: "Don't take your health for granted.", exampleFrench: "Ne prends pas ta santé pour acquise." },
  { group: "PRACTICAL", expression: "No pain, no gain", meaning: "On n'a rien sans rien", example: "I have to practice every day. No pain, no gain.", exampleFrench: "Je dois pratiquer tous les jours. On n'a rien sans rien." },
  { group: "PRACTICAL", expression: "Out of order", meaning: "En panne (machines)", example: "The elevator is out of order.", exampleFrench: "L'ascenseur est en panne." },
  { group: "PRACTICAL", expression: "Out of date", meaning: "Périmé / Dépassé", example: "This computer system is completely out of date.", exampleFrench: "Ce système informatique est complètement dépassé." },
  { group: "PRACTICAL", expression: "Up to date", meaning: "À jour / Moderne", example: "We need to keep our website up to date.", exampleFrench: "Nous devons garder notre site web à jour." },
  { group: "PRACTICAL", expression: "On purpose", meaning: "Exprès / Intentionnellement", example: "I didn't do it on purpose, it was an accident.", exampleFrench: "Je ne l'ai pas fait exprès, c'était un accident." },
  { group: "PRACTICAL", expression: "By accident / By mistake", meaning: "Par accident / Par erreur", example: "I deleted the file by mistake.", exampleFrench: "J'ai supprimé le fichier par erreur." },
  { group: "PRACTICAL", expression: "Sooner or later", meaning: "Tôt ou tard", example: "Sooner or later, he will find out the truth.", exampleFrench: "Tôt ou tard, il découvrira la vérité." },
  { group: "PRACTICAL", expression: "Day in, day out", meaning: "Jour après jour / Sans relâche", example: "He works 10 hours a day, day in, day out.", exampleFrench: "Il travaille 10 heures par jour, tous les jours." },
  { group: "PRACTICAL", expression: "Step by step", meaning: "Étape par étape / Pas à pas", example: "Don't rush, just follow the guide step by step.", exampleFrench: "Ne te précipite pas, suis le guide pas à pas." },
  { group: "PRACTICAL", expression: "In the long run", meaning: "À long terme / Sur le long terme", example: "Buying a good car is cheaper in the long run.", exampleFrench: "Acheter une bonne voiture est moins cher à long terme." },
  { group: "PRACTICAL", expression: "Behind the scenes", meaning: "En coulisses / Dans l'ombre", example: "A lot of work goes on behind the scenes.", exampleFrench: "Beaucoup de travail se fait en coulisses." },
  { group: "PRACTICAL", expression: "Call the shots", meaning: "Faire la loi / Commander", example: "In this company, the CEO calls the shots.", exampleFrench: "Dans cette entreprise, le PDG commande." },
  { group: "PRACTICAL", expression: "Safe and sound", meaning: "Sain et sauf", example: "The children arrived home safe and sound.", exampleFrench: "Les enfants sont arrivés à la maison sains et saufs." },
  { group: "PRACTICAL", expression: "In a nutshell", meaning: "En résumé / En bref", example: "In a nutshell, the project was a failure.", exampleFrench: "En résumé, le projet était un échec." },
  { group: "PRACTICAL", expression: "It's not my cup of tea", meaning: "Ce n'est pas mon truc", example: "I don't really like jazz, it's not my cup of tea.", exampleFrench: "Je n'aime pas vraiment le jazz, ce n'est pas mon truc." },
  { group: "PRACTICAL", expression: "Out of touch", meaning: "Coupé de la réalité", example: "Politicians are often out of touch with real life.", exampleFrench: "Les politiciens sont souvent coupés de la réalité." },
  { group: "PRACTICAL", expression: "Under pressure", meaning: "Sous pression", example: "I work better when I am under pressure.", exampleFrench: "Je travaille mieux quand je suis sous pression." },
  { group: "PRACTICAL", expression: "To be sick of", meaning: "En avoir marre de", example: "I'm sick of this situation.", exampleFrench: "J'en ai marre de cette situation." },
  { group: "PRACTICAL", expression: "Even though", meaning: "Même si / Bien que", example: "Even though it was cold, I went out.", exampleFrench: "Même s'il faisait froid, j'ai quand même sorti." },
];

export default function ExpressionsTab() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [learned, setLearned] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () => expressions.filter((item) =>
      item.expression.toLowerCase().includes(search.toLowerCase()) ||
      item.meaning.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, Expression[]> = {};
    filtered.forEach((item) => {
      groups[item.group] = groups[item.group] || [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (cardIndex >= filtered.length) {
      setCardIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, cardIndex]);

  const totalLearned = Object.values(learned).filter(Boolean).length;
  const currentCard = filtered[Math.min(cardIndex, Math.max(filtered.length - 1, 0))];

  const toggleReveal = (expression: string) => setRevealed((prev) => ({ ...prev, [expression]: !prev[expression] }));
  const toggleLearned = (expression: string) => setLearned((prev) => ({ ...prev, [expression]: !prev[expression] }));

  return (
    <div>
      <div style={{ padding: "20px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#F1F5F9" }}>
              Expressions Idiomatiques
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#94A3B8" }}>
              Plus de 100 expressions courantes pour parler comme un natif.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#94A3B8" }}>
              {totalLearned} / {expressions.length} expressions apprises
            </p>
            <div style={{ marginTop: "8px", width: "100%", background: "#1E293B", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: (totalLearned / expressions.length * 100) + "%", background: "#3B82F6", height: "100%", borderRadius: "4px", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0", borderBottom: "1px solid #1E293B" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCardIndex(0); }}
            placeholder="🔍 Rechercher une expression, signification ou exemple..."
            style={{ width: "100%", boxSizing: "border-box", background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontSize: "14px", outline: "none" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            <button
              onClick={() => setView("list")}
              style={{ flex: 1, minWidth: "120px", background: view === "list" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "list" ? 700 : 400 }}
            >
              📋 Liste
            </button>
            <button
              onClick={() => setView("cards")}
              style={{ flex: 1, minWidth: "120px", background: view === "cards" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "cards" ? 700 : 400 }}
            >
              🃏 Cartes
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0" }}>
        <p style={{ margin: 0, color: "#94A3B8", fontSize: "13px" }}>
          {filtered.length} résultat(s) · {totalLearned} appris
        </p>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "16px 0" }}>
          <p style={{ color: "#94A3B8", fontSize: "14px" }}>Aucune expression ne correspond à votre recherche.</p>
        </div>
      ) : view === "list" ? (
        <div style={{ padding: "0 0 80px" }}>
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{ padding: "16px 0" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#F1F5F9" }}>{groupTitles[group] || group}</h3>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
                {items.map((item) => {
                  const isRevealed = revealed[item.expression];
                  const isLearned = learned[item.expression];
                  return (
                    <div
                      key={item.expression}
                      onClick={() => toggleReveal(item.expression)}
                      style={{
                        background: isLearned ? "#052e16" : "#1E293B",
                        border: "1px solid " + (isLearned ? "#10B981" : "#334155"),
                        borderRadius: "10px",
                        padding: "12px 14px",
                        marginBottom: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>{item.expression}</span>
                          {isRevealed ? (
                            <div style={{ marginTop: "4px", fontSize: "14px", color: "#94A3B8" }}>
                              🇫🇷 {item.meaning}
                            </div>
                          ) : (
                            <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir la traduction</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLearned(item.expression); }}
                          style={{ background: isLearned ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer" }}
                        >
                          {isLearned ? "✓" : "○"}
                        </button>
                      </div>
                      {isRevealed && (
                        <div style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "13px" }}>
                          <div style={{ fontWeight: 700, marginBottom: "6px" }}>Exemple :</div>
                          <div>🇬🇧 {item.example}</div>
                          <div style={{ marginTop: "4px" }}>🇫🇷 {item.exampleFrench}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "20px 0 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
            <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "8px" }}>{cardIndex + 1} / {filtered.length}</p>
            <div
              onClick={() => currentCard && toggleReveal(currentCard.expression)}
              style={{
                width: "100%",
                minHeight: "220px",
                background: "#1E293B",
                border: "2px solid #334155",
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: currentCard ? "pointer" : "default",
                textAlign: "center",
                transition: "all 0.3s",
              }}
            >
              {currentCard ? (
                <>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#F1F5F9", marginBottom: "10px" }}>{currentCard.expression}</div>
                  {revealed[currentCard.expression] ? (
                    <>
                      <div style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "10px" }}>{currentCard.expression}</div>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#60A5FA" }}>{currentCard.meaning}</div>
                      <div style={{ marginTop: "16px", color: "#94A3B8", fontSize: "13px", textAlign: "left", width: "100%" }}>
                        <div style={{ marginBottom: "6px", fontWeight: 700 }}>Exemple :</div>
                        <div>🇬🇧 {currentCard.example}</div>
                        <div style={{ marginTop: "4px" }}>🇫🇷 {currentCard.exampleFrench}</div>
                      </div>
                    </>
                  ) : (
                    <p style={{ margin: 0, color: "#64748B", fontSize: "13px" }}>Appuie pour voir la traduction</p>
                  )}
                </>
              ) : (
                <p style={{ margin: 0, color: "#94A3B8", fontSize: "14px" }}>Aucune expression à afficher.</p>
              )}
            </div>
            {currentCard && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                <button
                  onClick={() => { toggleLearned(currentCard.expression); setRevealed((prev) => ({ ...prev, [currentCard.expression]: false })); }}
                  style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  ✓ Je sais
                </button>
                <button
                  onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed((prev) => ({ ...prev, [currentCard.expression]: false })); }}
                  style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  ✗ À revoir
                </button>
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                onClick={() => { setCardIndex((prev) => Math.max(0, prev - 1)); setRevealed({}); }}
                style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer" }}
              >
                ← Préc
              </button>
              <button
                onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed({}); }}
                style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer" }}
              >
                Suiv →
              </button>
            </div>
            <div style={{ display: "flex", gap: "4px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center", maxWidth: "360px" }}>
              {filtered.map((item, index) => (
                <div
                  key={item.expression}
                  onClick={() => { setCardIndex(index); setRevealed({}); }}
                  style={{ width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer", background: learned[item.expression] ? "#10B981" : index === cardIndex ? "#3B82F6" : "#334155" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
