# Description
Bonsai Hash Generator is a [website](https://trueryob.github.io/BonsaiHG/) that generates a bonsai based on an input to entertain those who are typing creative ideas out.<br>
A developer deployed vibe coding here using Claude and an [existing repository](https://gitlab.com/jallbrit/cbonsai).<br>

# Benefit
There is no usage limit unlike other competitives such as  google translate.<br>

# Issues
1] URL saving mechanism is not the best solution because of the scaling data size.<br>
I am considering of re-implementation by<br>
1. introducing a data compression technology<br>
2. introducing a multi-thread history reader system<br>
3. introducing a cookie (or whatever to avoid interfering with the local saving system)<br>
<br>
2] Layout sucks<br>
This is terrible right now. Especially when a bonsai is not forming the shape of bonsai.<br>
1. changes a scalalability of the input field<br>
2. changes the utility key (like tab) to an actual input<br>
3. imports the technology of cbonsai to this project<br>
