import Ember from 'ember';

export default Ember.Component.extend({
  resources: [
    {id: "skins", icon: "skins" },
    {id: "herbs", icon: "herbs" },
    {id: "ore", icon: "ore" },
    {id: "leather", icon: "leather" },
    {id: "piety", icon: "piety" },
    {id: "metal", icon: "metal" },
    // {id: "gold", icon: "gold", hideWithoutTrade: true },
  ],
});
