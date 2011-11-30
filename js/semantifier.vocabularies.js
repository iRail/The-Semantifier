/*!
 * The Semantifier script: hard coded reference to well known vocabularies
 * https://github.com/iRail/The-Semantifier
 *
 * Copyright 2011, MultimediaLab (Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
 * 
 * Licensed under the AGPL 3.0 license.
 * http://www.gnu.org/licenses/agpl.txt
 *
 *
 * Date: Mon Dec 5 00:00:00 2011 +0100
 * 
 * @copyright (C) 2011 by MMLab(Ghent University-IBBT) <http://multimedialab.elis.ugent.be> 
 * @license AGPLv3
 * @author Miel Vander Sande
 * 
 */
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

vocabularies["lode"] = new Object();
vocabularies["lode"]["name"] = "Linking Open Descriptions of Events";
vocabularies["lode"]["namespace"] = "http://linkedevents.org/ontology/";
vocabularies["lode"]["classes"] = new Array("Event");
vocabularies["lode"]["properties"] = new Array("atPlace","atTime","circa","illustrate","inSpace","involved","involvedAgent");

vocabularies["skos"] = new Object();
vocabularies["skos"]["name"] = "Simple Knowledge Organization System Reference";
vocabularies["skos"]["namespace"] = "http://www.w3.org/2004/02/skos/core#";
vocabularies["skos"]["classes"] = new Array("Concept","ConceptScheme","Collection","OrderedCollection");
vocabularies["skos"]["properties"] = new Array("inScheme","hasTopConcept","topConceptOf","altLabel","hiddenLabel","prefLabel","notation","changeNote","definition","editorialNote","example","historyNote","note","scopeNote","broader","broaderTransitive","narrower","narrowerTransitive","related","semanticRelation","member","memberList","broadMatch","closeMatch","exactMatch","mappingRelation","narrowMatch","relatedMatch");

vocabularies["v"] = new Object();
vocabularies["v"]["name"] = "Representing vCard Objects";
vocabularies["v"]["namespace"] = "http://www.w3.org/2006/vcard/ns#";
vocabularies["v"]["classes"] = new Array("VCard","Name","Address","Organisation","Location","Label","Tel","Email","Dom","Home","Intl","Parcel","Postal","Pref","Work","Dom","Home","Intl","Parcel","Postal","Pref","Work","Internet","X400","Pref","BBS","Car","Cell","Fax","Home","ISDN","Modem","Msg","PCS","Pager","Video","Voice","Work","Pref");
vocabularies["v"]["properties"] = new Array("adr","agent","bday","category","class","email","fn","geo","key","logo","mailer","n","nickname","note","org","photo","rev","role","sort-string","sound","tel","title","tz","uid","url","additional-name","family-name","given-name","honorific-prefix","honorific-suffix","country-name","extended-address","label","locality","postal-code","post-office-box","region","street-address","organization-name","organization-unit","latitude","longitude");


//http://www.geonames.org/ontology#

vocabularies["gn"] = new Object();
vocabularies["gn"]["name"] = "Geonames";
vocabularies["gn"]["namespace"] = "http://linkedevents.org/ontology/";
vocabularies["gn"]["classes"] = new Array("Feature");
vocabularies["gn"]["properties"] = new Array("name","population","postalCode");

vocabularies["wgs84"] = new Object();
vocabularies["wgs84"]["name"] = "WGS84 Geo Positioning";
vocabularies["wgs84"]["namespace"] = "http://www.w3.org/2003/01/geo/wgs84_pos#";
vocabularies["wgs84"]["classes"] = new Array("SpatialThing","TemporalThing","Event","Point");
vocabularies["wgs84"]["properties"] = new Array("lat","long","location","time");

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