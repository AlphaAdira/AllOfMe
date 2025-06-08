<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="tilemap_packed" tilewidth="18" tileheight="18" tilecount="112" columns="16">
 <image source="tilemap_packed.png" width="288" height="126"/>
 <tile id="4">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="5">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="6">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="11">
  <properties>
   <property name="climb" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="13">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="13" duration="250"/>
   <frame tileid="29" duration="250"/>
  </animation>
 </tile>
 <tile id="20">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="21">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="22">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="38">
  <properties>
   <property name="climb" type="bool" value="true"/>
   <property name="collides" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="43">
  <properties>
   <property name="climb" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="45">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="64">
  <animation>
   <frame tileid="64" duration="100"/>
   <frame tileid="65" duration="100"/>
  </animation>
 </tile>
 <tile id="78">
  <animation>
   <frame tileid="78" duration="250"/>
   <frame tileid="79" duration="250"/>
  </animation>
 </tile>
 <tile id="94">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="94" duration="250"/>
   <frame tileid="95" duration="250"/>
  </animation>
 </tile>
 <tile id="95">
  <properties>
   <property name="death" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
