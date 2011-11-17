

var vocabularies = new Object();

vocabularies["foaf"] = new Object();
vocabularies["foaf"]["name"] = "Friend Of A Friend";
vocabularies["foaf"]["namespace"] = "http://xmlns.com/foaf/0.1/";
vocabularies["foaf"]["classes"] = new Array("Agent","Document","Group","Image","LabelProperty","OnlineAccount","OnlineChatAccount","OnlineEcommerceAccount","OnlineGamingAccount","Organization","Person","PersonalProfileDocument","Project");
vocabularies["foaf"]["properties"] = new Array("account","accountName","accountServiceHomepage","age","aimChatID","based_near","birthday","currentProject","depiction","depicts","dnaChecksum","familyName","family_name","firstName","focus","fundedBy","geekcode","gender","givenName","givenname","holdsAccount","homepage","icqChatID","img","interest","isPrimaryTopicOf","jabberID","knows","lastName","logo","made","maker","mbox","mbox_sha1sum","member","membershipClass","msnChatID","myersBriggs","name","nick","openid","page","pastProject","phone","plan","primaryTopic","publications","schoolHomepage","sha1","skypeID","status","surname","theme","thumbnail","tipjar","title","topic","topic_interest","weblog","workInfoHomepage","workplaceHomepage","yahooChatID");

vocabularies["dc"] = new Object();
vocabularies["dc"]["name"] = "Dublin Core";
vocabularies["dc"]["namespace"] = "http://purl.org/dc/elements/1.1/";
vocabularies["dc"]["classes"] = new Array("Agent","AgentClass","BibliographicResource","FileFormat","Frequency","Jurisdiction","LicenseDocument","LinguisticSystem","Location","LocationPeriodOrJurisdiction","MediaType","MediaTypeOrExtent","MethodOfAccrual","MethodOfInstruction","PeriodOfTime","PhysicalMedium","PhysicalResource","Policy","ProvenanceStatement","RightsStatement","SizeOrDuration","Standard");
vocabularies["dc"]["properties"] = new Array("contributor","coverage","creator","date","description","format","identifier","language","publisher","relation","rights","source","subject","title","type");

vocabularies["dcterms"] = new Object();
vocabularies["dcterms"]["name"] = "Dublin Core Terms";
vocabularies["dcterms"]["namespace"] = "http://purl.org/dc/terms/";
vocabularies["dcterms"]["classes"] = new Array("Agent","AgentClass","BibliographicResource","FileFormat","Frequency","Jurisdiction","LicenseDocument","LinguisticSystem","Location","LocationPeriodOrJurisdiction","MediaType","MediaTypeOrExtent","MethodOfAccrual","MethodOfInstruction","PeriodOfTime","PhysicalMedium","PhysicalResource","Policy","ProvenanceStatement","RightsStatement","SizeOrDuration","Standard");
vocabularies["dcterms"]["properties"] = new Array("abstract","accessRights","accrualMethod","accrualPeriodicity","accrualPolicy","alternative","audience","available","bibliographicCitation","conformsTo","contributor","coverage","created","creator","date","dateAccepted","dateCopyrighted","dateSubmitted","description","educationLevel","extent","format","hasFormat","hasPart","hasVersion","identifier","instructionalMethod","isFormatOf","isPartOf","isReferencedBy","isReplacedBy","isRequiredBy","issued","isVersionOf","language","license","mediator","medium","modified","provenance","publisher","references","relation","replaces","requires","rights","rightsHolder","source","spatial","subject","tableOfContents","temporal","title","type","valid");

/*
vocabularies["sioc"] = new Object();
vocabularies["sioc"]["name"] = "Socially Interconnected Online Communities";
vocabularies["sioc"]["namespace"] = "http://rdfs.org/sioc/ns#";

vocabularies["gr"] = new Object();
vocabularies["gr"]["name"] = "Good Relations";
vocabularies["gr"]["namespace"] = "http://purl.org/goodrelations/v1";

vocabularies["mo"] = new Object();
vocabularies["mo"]["name"] = "The Music Ontology";
vocabularies["mo"]["namespace"] = "http://purl.org/ontology/mo/";
*/