Language = ___* b:Block ___* {return b}
Block = f:First_sentence s:Normal_sentence* {return [].concat(f).concat([...s?s:[]])}
Normal_sentence = Separator_4 f:First_sentence {return f}
First_sentence = Sentence_create / Sentence_edit / Sentence_delete / Sentence_search / Sentence_execute
Sentence_create = "+" s:Store_name i:Item_id? a:Operation_attributes? m:Operation_metattributes? {return {sentence:"create in store",store:s,item:i,attributes:a, metadata:m}}
Sentence_edit = "!" s:Store_name i:Item_id? a:Operation_attributes? m:Operation_metattributes? {return {sentence:"edit from store",store:s,item:i,attributes:a, metadata:m}}
Sentence_delete = "-" s:Store_name i:Item_id? a:Operation_attributes? m:Operation_metattributes? {return {sentence:"delete from store",store:s,item:i,attributes:a, metadata:m}}
Sentence_search = "?" s:Store_name i:Item_id? a:Operation_attributes? m:Operation_metattributes? {return {sentence:"search in store",store:s,item:i,attributes:a, metadata:m}}
Sentence_execute = ":" s:Command_name a:Operation_attributes? m:Operation_metattributes? {return {sentence:"execute from store",command:s,attributes:a, metadata:m}}
Item_id = Separator_5 i:Item_id_content {return i}
Item_id_content = (!(Separator_4/Separator_1/EOL/EOF).)+ {return text()}
Store_name = (!(Separator_4/Separator_5/Separator_1/EOL/EOF).)+ {return text()}
Command_name = Store_name
Operation_attributes = a:Operation_attribute* {return Object.assign({}, ...a)}
Operation_attribute = Separator_1 a:Attribute {return a}
Operation_metattributes = a:Operation_metattribute* {return Object.assign({}, ...a)}
Operation_metattribute = Separator_1 ":" a:Attribute {return a}
Attribute = k:Attribute_key v:(Separator_2 Attribute_value)? {return {[k]:v?v[1]:null}}
Attribute_key = k:(!(Separator_2/Separator_1/EOL/EOF) Scapable_string)+ {return k.map(i=>i[1]).join("").trim()}
Attribute_value = v:(!(Separator_1/EOL/EOF) Scapable_slash)+ {return v.map(i=>i[1]).join("").trim()}
Scapable_slash = Scaped_slash/.
Scapable_string = Scaped_colon/Scaped_slash/.
Scaped_slash = "/" s:"/"+ {return s.join("")}
Scaped_colon = ":" s:":"+ {return s.join("")}
Separator_1 = "/" !("/")+
Separator_2 = ":" !(":")+
Separator_3 = Boolean_operator
Separator_4 = "\n"
Separator_5 = ":"
Boolean_operator = "<="/">="/"<"/">"/"!="/"="/":in:"/":!in:"/"~"/"!~"
NEOL = (!(EOL/EOF).)+ {return text()}
EOL = __
EOF = !.
_ = " "/"\t"
__ = "\r\n"/"\n"
___ = __ / _