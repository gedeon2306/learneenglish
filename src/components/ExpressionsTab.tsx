import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaListUl, FaThLarge, FaCheck, FaRegCircle, FaVolumeUp, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { speakSequence, stopSpeech } from "../utils/speech";
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
  { group: "EVERYDAY", expression: "Same thing", meaning: "La même chose", example: "We ordered the same thing.", exampleFrench: "Nous avons commandé la même chose." },
  { group: "EVERYDAY", expression: "Something else", meaning: "Autre chose", example: "I'd like something else.", exampleFrench: "Je voudrais autre chose." },
  { group: "EVERYDAY", expression: "What's next?", meaning: "Et ensuite ?", example: "What's next on the agenda?", exampleFrench: "Quelle est la suite au programme ?" },
  { group: "EVERYDAY", expression: "It is close", meaning: "C'est proche", example: "The station is close.", exampleFrench: "La gare est proche." },
  { group: "EVERYDAY", expression: "It is not far", meaning: "Ce n'est pas loin", example: "The beach is not far.", exampleFrench: "La plage n'est pas loin." },
  { group: "EVERYDAY", expression: "It's a pleasure to meet you", meaning: "Enchanté(e) de vous rencontrer", example: "Hello, it's a pleasure to meet you.", exampleFrench: "Bonjour, enchanté de vous rencontrer." },
  { group: "EVERYDAY", expression: "Look who's here!", meaning: "Tiens, regarde qui est là !", example: "Look who's here! It's John!", exampleFrench: "Regarde qui est là ! C'est John !" },
  { group: "EVERYDAY", expression: "Being kind", meaning: "Être gentil", example: "Being kind costs nothing.", exampleFrench: "Être gentil ne coûte rien." },
  { group: "EVERYDAY", expression: "That's right", meaning: "C'est exact / c'est ça", example: "You're from London? That's right.", exampleFrench: "Vous êtes de Londres ? C'est ça." },
  { group: "EVERYDAY", expression: "I hope you're well", meaning: "J'espère que vous allez bien", example: "I hope you're well, I've missed you.", exampleFrench: "J'espère que tu vas bien, tu m'as manqué." },
  { group: "EVERYDAY", expression: "All of you", meaning: "Vous tous", example: "I want to thank all of you.", exampleFrench: "Je veux vous remercier tous." },
  { group: "EVERYDAY", expression: "How about...?", meaning: "Que dirais-tu de ... ? / Et si ... ?", example: "How about going to the cinema?", exampleFrench: "Et si on allait au cinéma ?" },
  { group: "EVERYDAY", expression: "What kind of...?", meaning: "Quel genre de ... ?", example: "What kind of music do you like?", exampleFrench: "Quel genre de musique aimes-tu ?" },
  { group: "EVERYDAY", expression: "Go-to guy", meaning: "L'homme de la situation / la personne ressource", example: "He's my go-to guy for IT issues.", exampleFrench: "C'est mon homme de confiance pour les problèmes informatiques." },
  { group: "EVERYDAY", expression: "To meet someone's needs", meaning: "Répondre aux besoins de quelqu'un", example: "This software meets our needs perfectly.", exampleFrench: "Ce logiciel répond parfaitement à nos besoins." },
  { group: "EVERYDAY", expression: "Make sure", meaning: "S'assurer / vérifier", example: "Make sure you lock the door.", exampleFrench: "Assure-toi de verrouiller la porte." },
  { group: "EVERYDAY", expression: "Most of the time", meaning: "La plupart du temps", example: "Most of the time, I walk to work.", exampleFrench: "La plupart du temps, je vais au travail à pied." },
  { group: "EVERYDAY", expression: "Get ready", meaning: "Se préparer", example: "We need to get ready for the meeting.", exampleFrench: "Nous devons nous préparer pour la réunion." },
  { group: "EVERYDAY", expression: "Get dressed", meaning: "S'habiller", example: "I'll get dressed and meet you downstairs.", exampleFrench: "Je m'habille et je te rejoins en bas." },
  { group: "EVERYDAY", expression: "Sounds like", meaning: "On dirait / ça a l'air", example: "Sounds like a great idea!", exampleFrench: "On dirait une bonne idée !" },
  { group: "EVERYDAY", expression: "It seems like", meaning: "On dirait que / il semble que", example: "It seems like it's going to rain.", exampleFrench: "On dirait qu'il va pleuvoir." },
  { group: "EVERYDAY", expression: "I feel sleepy", meaning: "J'ai sommeil", example: "I feel sleepy, I should go to bed.", exampleFrench: "J'ai sommeil, je devrais aller me coucher." },
  { group: "EVERYDAY", expression: "Feel groggy", meaning: "Se sentir faible / vaseux", example: "I feel groggy after that nap.", exampleFrench: "Je me sens vaseux après cette sieste." },
  { group: "EVERYDAY", expression: "I feel like", meaning: "J'ai l'impression que / j'ai envie de", example: "I feel like it's too late.", exampleFrench: "J'ai l'impression qu'il est trop tard." },
  { group: "EVERYDAY", expression: "Get home", meaning: "Rentrer à la maison", example: "I'll get home around 6 PM.", exampleFrench: "Je rentrerai à la maison vers 18h." },
  { group: "EVERYDAY", expression: "Take a nap", meaning: "Faire une sieste", example: "I'm going to take a short nap.", exampleFrench: "Je vais faire une petite sieste." },
  { group: "EVERYDAY", expression: "That's good to hear", meaning: "C'est une bonne nouvelle", example: "You got the job? That's good to hear!", exampleFrench: "Tu as eu le poste ? C'est une bonne nouvelle !" },
  { group: "EVERYDAY", expression: "I hope", meaning: "J'espère", example: "I hope you're okay.", exampleFrench: "J'espère que tu vas bien." },
  { group: "EVERYDAY", expression: "I hope so", meaning: "Je l'espère", example: "Will he come? I hope so.", exampleFrench: "Viendra-t-il ? Je l'espère." },
  { group: "EVERYDAY", expression: "Don't worry", meaning: "Ne t'inquiète pas", example: "Don't worry, everything is under control.", exampleFrench: "Ne t'inquiète pas, tout est sous contrôle." },
  { group: "EVERYDAY", expression: "Not at all", meaning: "Pas du tout", example: "Are you tired? Not at all.", exampleFrench: "Es-tu fatigué ? Pas du tout." },
  { group: "EVERYDAY", expression: "Not really", meaning: "Pas vraiment", example: "Do you like it? Not really.", exampleFrench: "Tu aimes ? Pas vraiment." },
  { group: "EVERYDAY", expression: "Not right away", meaning: "Pas tout de suite", example: "I'll do it, but not right away.", exampleFrench: "Je le ferai, mais pas tout de suite." },
  { group: "EVERYDAY", expression: "For a while", meaning: "Pendant un moment", example: "I've been waiting for a while.", exampleFrench: "J'attends depuis un moment." },
  { group: "EVERYDAY", expression: "It's been a while since", meaning: "Ça fait un moment que", example: "It's been a while since we met.", exampleFrench: "Ça fait un moment qu'on s'est vus." },
  { group: "EVERYDAY", expression: "Now that I think about it", meaning: "Maintenant que j'y pense", example: "Now that I think about it, you're right.", exampleFrench: "Maintenant que j'y pense, tu as raison." },
  { group: "EVERYDAY", expression: "I'll let you know", meaning: "Je vous tiendrai au courant", example: "I'll let you know the decision tomorrow.", exampleFrench: "Je vous tiendrai au courant de la décision demain." },
  { group: "EVERYDAY", expression: "What's wrong?", meaning: "Qu'est-ce qui ne va pas ?", example: "What's wrong? You look sad.", exampleFrench: "Qu'est-ce qui ne va pas ? Tu as l'air triste." },
  { group: "EVERYDAY", expression: "Which one to choose", meaning: "Lequel choisir", example: "There are so many options, which one to choose?", exampleFrench: "Il y a tant d'options, lequel choisir ?" },
  { group: "EVERYDAY", expression: "Some of these", meaning: "Certains de ceux-ci", example: "Some of these books are interesting.", exampleFrench: "Certains de ces livres sont intéressants." },
  { group: "EVERYDAY", expression: "First things first", meaning: "Avant toute chose", example: "First things first, let's have breakfast.", exampleFrench: "Avant toute chose, prenons le petit-déjeuner." },
  { group: "EVERYDAY", expression: "Got it", meaning: "J'ai compris / c'est bon", example: "Can you do that? Got it.", exampleFrench: "Peux-tu faire ça ? Compris." },
  
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
  { group: "REACTIONS", expression: "Strongly agree", meaning: "Tout à fait d'accord", example: "I strongly agree with your proposal.", exampleFrench: "Je suis tout à fait d'accord avec votre proposition." },
  { group: "REACTIONS", expression: "Sounds great!", meaning: "Ça a l'air super !", example: "Let's meet at 8? Sounds great!", exampleFrench: "On se retrouve à 8h ? Ça a l'air super !" },
  { group: "REACTIONS", expression: "I totally get that", meaning: "Je comprends parfaitement", example: "I totally get that you're busy.", exampleFrench: "Je comprends parfaitement que tu sois occupé." },
  { group: "REACTIONS", expression: "It gets to me", meaning: "Ça m'arrive / ça me touche", example: "Sometimes this job gets to me.", exampleFrench: "Parfois, ce travail m'atteint." },
  { group: "REACTIONS", expression: "I can't help... + v-ing", meaning: "Je ne peux m'empêcher de...", example: "I can't help laughing when I see him.", exampleFrench: "Je ne peux pas m'empêcher de rire quand je le vois." },
  { group: "REACTIONS", expression: "I've had enough / I'm fed up", meaning: "J'en ai assez / j'en ai marre", example: "I've had enough of your excuses!", exampleFrench: "J'en ai assez de tes excuses !" },
  { group: "REACTIONS", expression: "Beg to differ", meaning: "Je ne suis pas d'accord (poliment)", example: "I beg to differ with your opinion.", exampleFrench: "Je ne suis pas d'accord avec votre opinion." },
  { group: "REACTIONS", expression: "Give it a go", meaning: "Essayer (pour la première fois)", example: "Why not give it a go? You might like it.", exampleFrench: "Pourquoi ne pas essayer ? Tu pourrais aimer." },
  { group: "REACTIONS", expression: "Give it a shot", meaning: "Essayer / tenter sa chance", example: "I'll give it a shot, but I'm not sure.", exampleFrench: "Je vais essayer, mais je ne suis pas sûr." },
  { group: "REACTIONS", expression: "No way!", meaning: "Certainement pas ! / Pas question !", example: "No way! I'm not going there.", exampleFrench: "Pas question ! Je n'y vais pas." },
  { group: "REACTIONS", expression: "Fair enough", meaning: "D'accord / c'est entendu", example: "If you can't come, fair enough.", exampleFrench: "Si tu ne peux pas venir, d'accord." },
  { group: "REACTIONS", expression: "Tell me about it!", meaning: "Tu m'en diras tant !", example: "It's so cold today. - Tell me about it!", exampleFrench: "Il fait si froid aujourd'hui. - Tu me l'dis !" },
  { group: "REACTIONS", expression: "You can say that again!", meaning: "Tu l'as dit !", example: "This movie is boring. - You can say that again!", exampleFrench: "Ce film est ennuyeux. - Tu l'as dit !" },
  { group: "REACTIONS", expression: "Point taken", meaning: "J'ai compris / bon argument", example: "Point taken, I'll change my approach.", exampleFrench: "Bon argument, je vais changer d'approche." },
  { group: "REACTIONS", expression: "What's your take?", meaning: "Quel est ton avis ?", example: "What's your take on the new policy?", exampleFrench: "Quel est ton avis sur la nouvelle politique ?" },
  { group: "REACTIONS", expression: "Can you tell me about...?", meaning: "Peux-tu me parler de... ?", example: "Can you tell me about your experience?", exampleFrench: "Peux-tu me parler de ton expérience ?" },
  { group: "REACTIONS", expression: "I'm on it", meaning: "Je m'en occupe / je suis sur le coup", example: "Don't worry, I'm on it right now.", exampleFrench: "Ne t'inquiète pas, je m'en occupe tout de suite." },
  
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
  { group: "IDIOMS", expression: "Have a blast", meaning: "S'éclater / s'amuser énormément", example: "We had a blast at the party.", exampleFrench: "On s'est éclatés à la fête." },
  { group: "IDIOMS", expression: "It makes my day", meaning: "Ça me fait très plaisir / ça fait ma journée", example: "Your kind words make my day.", exampleFrench: "Tes paroles gentilles me font très plaisir." },
  { group: "IDIOMS", expression: "Against the clock", meaning: "Contre la montre", example: "We're working against the clock.", exampleFrench: "On travaille contre la montre." },
  { group: "IDIOMS", expression: "Keep up that pace", meaning: "Garder ce rythme", example: "Keep up that pace, you're doing well.", exampleFrench: "Garde ce rythme, tu t'en sors bien." },
  { group: "IDIOMS", expression: "Stay on track", meaning: "Rester sur la bonne voie", example: "We need to stay on track with the plan.", exampleFrench: "Nous devons rester sur la bonne voie avec le plan." },
  { group: "IDIOMS", expression: "Go as expected", meaning: "Se dérouler comme prévu", example: "Everything went as expected.", exampleFrench: "Tout s'est déroulé comme prévu." },
  { group: "IDIOMS", expression: "Safety rules", meaning: "Règles de sécurité", example: "Safety rules must be followed.", exampleFrench: "Les règles de sécurité doivent être respectées." },
  { group: "IDIOMS", expression: "Stay fit", meaning: "Rester en forme", example: "I exercise every day to stay fit.", exampleFrench: "Je fais du sport tous les jours pour rester en forme." },
  { group: "IDIOMS", expression: "It's all about", meaning: "Tout est question de / il s'agit de", example: "It's all about communication.", exampleFrench: "Tout est question de communication." },
  { group: "IDIOMS", expression: "Plan ahead", meaning: "Planifier à l'avance", example: "We should plan ahead to avoid problems.", exampleFrench: "Nous devrions planifier à l'avance pour éviter les problèmes." },
  { group: "IDIOMS", expression: "Not too far away", meaning: "Pas trop loin", example: "The park is not too far away.", exampleFrench: "Le parc n'est pas trop loin." },
  { group: "IDIOMS", expression: "Make time for", meaning: "Prendre le temps pour", example: "Make time for your hobbies.", exampleFrench: "Prends du temps pour tes loisirs." },
  { group: "IDIOMS", expression: "To grow to appreciate", meaning: "Apprendre à apprécier", example: "I've grown to appreciate classical music.", exampleFrench: "J'ai appris à apprécier la musique classique." },
  { group: "IDIOMS", expression: "Spare time", meaning: "Temps libre", example: "In my spare time, I read.", exampleFrench: "Pendant mon temps libre, je lis." },
  { group: "IDIOMS", expression: "Keep in mind", meaning: "Garder à l'esprit", example: "Keep in mind the deadline is Friday.", exampleFrench: "Garde à l'esprit que la date limite est vendredi." },
  { group: "IDIOMS", expression: "It takes", meaning: "Il faut / ça prend", example: "It takes time to learn a language.", exampleFrench: "Il faut du temps pour apprendre une langue." },
  { group: "IDIOMS", expression: "To grab attention", meaning: "Capter l'attention", example: "The ad is designed to grab attention.", exampleFrench: "La pub est conçue pour capter l'attention." },
  { group: "IDIOMS", expression: "To be faced with", meaning: "Être confronté à", example: "We are faced with a difficult choice.", exampleFrench: "Nous sommes confrontés à un choix difficile." },
  { group: "IDIOMS", expression: "To be thrilled", meaning: "Être ravi / enthousiaste", example: "I'm thrilled to meet you.", exampleFrench: "Je suis ravi de vous rencontrer." },
  { group: "IDIOMS", expression: "To be eager", meaning: "Être impatient / désireux", example: "I'm eager to start the project.", exampleFrench: "Je suis impatient de commencer le projet." },
  { group: "IDIOMS", expression: "To be all set", meaning: "Tout est prêt", example: "We're all set for the presentation.", exampleFrench: "Nous sommes prêts pour la présentation." },
  { group: "IDIOMS", expression: "Need a hand", meaning: "Avoir besoin d'aide", example: "Do you need a hand with that?", exampleFrench: "Tu as besoin d'aide pour ça ?" },
  { group: "IDIOMS", expression: "Having a hard time", meaning: "Avoir du mal", example: "I'm having a hard time understanding this.", exampleFrench: "J'ai du mal à comprendre ça." },
  { group: "IDIOMS", expression: "Having a good time", meaning: "Passer un bon moment", example: "We're having a good time at the beach.", exampleFrench: "On passe un bon moment à la plage." },
  { group: "IDIOMS", expression: "Manage to / succeed in", meaning: "Arriver à faire / réussir à faire", example: "I managed to finish on time.", exampleFrench: "J'ai réussi à finir à l'heure." },

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
  { group: "FEELINGS", expression: "It happens to all of us", meaning: "Ça nous arrive à tous", example: "Don't worry, it happens to all of us.", exampleFrench: "Ne t'inquiète pas, ça nous arrive à tous." },
  { group: "FEELINGS", expression: "I'm starving", meaning: "Je meurs de faim", example: "I'm starving, let's eat.", exampleFrench: "Je meurs de faim, mangeons." },
  { group: "FEELINGS", expression: "I Could use...", meaning: "J'aimerais bien / j'aurais besoin de", example: "I could use a coffee right now.", exampleFrench: "J'aimerais bien un café maintenant." },
  { group: "FEELINGS", expression: "I'm looking for", meaning: "Je cherche", example: "I'm looking for my glasses.", exampleFrench: "Je cherche mes lunettes." },
  { group: "FEELINGS", expression: "I'm looking forward to it", meaning: "J'ai hâte", example: "I'm looking forward to the holidays.", exampleFrench: "J'ai hâte des vacances." },
  { group: "FEELINGS", expression: "I've always wondered", meaning: "Je me suis toujours demandé", example: "I've always wondered about that.", exampleFrench: "Je me suis toujours demandé à ce sujet." },
  { group: "FEELINGS", expression: "Being kind", meaning: "Être gentil", example: "Being kind is important.", exampleFrench: "Être gentil est important." },
  { group: "FEELINGS", expression: "It gets to me", meaning: "Ça m'affecte / ça m'arrive", example: "Sometimes the noise gets to me.", exampleFrench: "Parfois le bruit m'affecte." },
  { group: "FEELINGS", expression: "Look a bit down", meaning: "Avoir l'air un peu abattu", example: "He looks a bit down today.", exampleFrench: "Il a l'air un peu abattu aujourd'hui." },
  { group: "FEELINGS", expression: "To be related to", meaning: "Être lié à", example: "Stress is often related to work.", exampleFrench: "Le stress est souvent lié au travail." },
  { group: "FEELINGS", expression: "To struggle with", meaning: "Lutter contre / avoir du mal avec", example: "I struggle with math.", exampleFrench: "J'ai du mal avec les maths." },
  { group: "FEELINGS", expression: "I'm kinda (kind of) tired", meaning: "Je suis un peu fatigué", example: "I'm kinda tired, I should sleep.", exampleFrench: "Je suis un peu fatigué, je devrais dormir." },

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
  const [learned, setLearned] = useState<Record<string, boolean>>(() => loadFromStorage(STORAGE_KEYS.learnedExpressions, {}));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.learnedExpressions, learned);
  }, [learned]);

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

  const speakExpression = (item: Expression) => {
    stopSpeech();
    speakSequence([
      { text: item.expression, lang: "en-US" },
      { text: item.meaning, lang: "fr-FR" },
      { text: `Exemple : ${item.example}`, lang: "en-US" },
      { text: `Traduction : ${item.exampleFrench}`, lang: "fr-FR" },
    ]);
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaSearch style={{ color: "#94A3B8", minWidth: "18px" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCardIndex(0); }}
              placeholder="Rechercher une expression, signification ou exemple..."
              style={{ width: "100%", boxSizing: "border-box", background: "#1E293B", border: "1px solid #334155", borderRadius: "10px", padding: "12px 14px", color: "#E2E8F0", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
            <button
              onClick={() => setView("list")}
              style={{ flex: 1, minWidth: "120px", background: view === "list" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "list" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <FaListUl /> Liste
            </button>
            <button
              onClick={() => setView("cards")}
              style={{ flex: 1, minWidth: "120px", background: view === "cards" ? "#3B82F6" : "#1E293B", border: "none", borderRadius: "8px", padding: "8px", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: view === "cards" ? 700 : 400, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <FaThLarge /> Cartes
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
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: "16px", color: isLearned ? "#4ADE80" : "#F1F5F9" }}>{item.expression}</span>
                          {isRevealed ? (
                            <div style={{ marginTop: "6px", fontSize: "14px", color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            🇫🇷 {item.meaning}
                          </div>
                          ) : (
                            <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Appuie pour voir la traduction</div>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLearned(item.expression); }}
                          style={{ background: isLearned ? "#10B981" : "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {isLearned ? <FaCheck /> : <FaRegCircle />}
                          </button>
                          <button
                            type="button"
                            style={{ background: "#334155", border: "none", borderRadius: "6px", padding: "4px 8px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                            onClick={(e) => { e.stopPropagation(); speakExpression(item); }}
                          >
                            <FaVolumeUp />
                          </button>
                        </div>
                      </div>
                      {isRevealed && (
                        <div style={{ margin: "8px 0 0", color: "#94A3B8", fontSize: "13px" }}>
                          <div style={{ fontWeight: 700, marginBottom: "6px" }}>Exemple :</div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>🇬🇧</div> {item.example} <br />
                          <div style={{ marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇫🇷</div> {item.exampleFrench}
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
          <p style={{ color: "#94A3B8", fontSize: "13px", marginBottom: "8px" }}>{cardIndex + 1} / {filtered.length}</p>
          <div
            onClick={() => currentCard && toggleReveal(currentCard.expression)}
            style={{
              width: "100%",
              maxWidth: "360px",
              minHeight: "200px",
              background: revealed[currentCard?.expression] ? "#1E3A5F" : "#1E293B",
              border: "2px solid " + (revealed[currentCard?.expression] ? "#3B82F6" : "#334155"),
              borderRadius: "16px",
              padding: "24px",
              boxSizing: "border-box",
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
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#60A5FA" }}>🇫🇷 {currentCard.meaning}</div>
                    <div style={{ marginTop: "16px", color: "#94A3B8", fontSize: "13px", textAlign: "left", width: "100%" }}>
                      <div style={{ marginBottom: "6px", fontWeight: 700 }}>Exemple :</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>🇬🇧</div> {currentCard.example} <br />
                      <div style={{ marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "6px" }}>🇫🇷</div> {currentCard.exampleFrench}
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

          {currentCard && revealed[currentCard.expression] && (
            <>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px", width: "100%", maxWidth: "360px" }}>
                <button
                  onClick={() => {
                    toggleLearned(currentCard.expression);
                    setRevealed((prev) => ({ ...prev, [currentCard.expression]: false }));
                    setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                  }}
                  style={{ flex: 1, background: "#10B981", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <FaCheck /> Je sais
                </button>
                <button
                  onClick={() => {
                    setRevealed((prev) => ({ ...prev, [currentCard.expression]: false }));
                    setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1));
                  }}
                  style={{ flex: 1, background: "#EF4444", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <FaTimes /> À revoir
                </button>
              </div>
              <button
                type="button"
                onClick={() => currentCard && speakExpression(currentCard)}
                style={{ width: "100%", maxWidth: "360px", background: "#334155", border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px" }}
              >
                <FaVolumeUp /> Son
              </button>
            </>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
            <button
              onClick={() => { setCardIndex((prev) => Math.max(0, prev - 1)); setRevealed({}); }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FaArrowLeft /> Préc
            </button>
            <button
              onClick={() => { setCardIndex((prev) => Math.min(filtered.length - 1, prev + 1)); setRevealed({}); }}
              style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "8px", padding: "8px 16px", color: "#94A3B8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              Suiv <FaArrowRight />
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
      )}
    </div>
  );
}
