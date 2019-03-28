function Stat(name, calc, max) {
  this.name = name;
  this.calc = calc;
  this.max = max;
  this.value = 0;
  this.desc = null;
  this.label = { label: null };
  this.calcMod = function(abilityScore) {
    return (0.99 * abilityScore - Math.pow(0.09 * abilityScore,2))
  }
  this.calcP = function(abilityScore) {
    return Math.min(3.3*abilityScore - 0.027*Math.pow(abilityScore,2),100);
  }
  this.calcS = function(values) {
    var max = values[0];
    var mid = values[1];
    var min = values[2];
    return (mid-min) / (max-min);
  }
  this.calcRes = function(values, p, s) {
    var max = values[0];
    var mid = values[1];
    var min = values[2];
    return min + (max-min) * this.lerpN(p/100, s);
  }
  this.lerpN = function(p, s) {
    if(s.toFixed(3) == 0.5) {
      return p;
    }
    if(p == 0.0) {
      return p;
    }
    if(p == 1.0) {
      return p;
    }
    if(s != 0.5) {
      return Math.pow(Math.E,-1 * (Math.log(p) * Math.log(s) / Math.log(2)))
      //return Math.log(-1 * (Math.log(p) * Math.log(s) / Math.log(2)));
    }
  }
}

angular.module('splatApp').stats = function ($scope) {
  $scope.stats = {
    'Swim Speed': new Stat("潜行速度", function(loadout) {
      var default_swim_speed = null;
      var swim_speed_parameters = null;
      if(loadout.weapon.speedLevel == 'Low') {
        swim_speed_parameters = $scope.parameters["Swim Speed"]["Heavy"];
      }
      if(loadout.weapon.speedLevel == 'Middle') {
        swim_speed_parameters = $scope.parameters["Swim Speed"]["Mid"];
      }
      if(loadout.weapon.speedLevel == "High") {
        swim_speed_parameters = $scope.parameters["Swim Speed"]["Light"];
      }

      var abilityScore = loadout.calcAbilityScore('Swim Speed Up');      
      var p = this.calcP(abilityScore);

      if(loadout.hasAbility('Ninja Squid')) {
        p = p * 0.8;
      }

      var s = this.calcS(swim_speed_parameters);
      var swim_speed = this.calcRes(swim_speed_parameters, p, s);

      if(loadout.hasAbility('Ninja Squid')) {
        swim_speed = swim_speed * 0.9;
      }

      var delta = ((swim_speed / swim_speed_parameters[2] - 1) * 100).toFixed(1).toString();

      // Debug log
      var swim_speed_debug_log = {"Swim Speed":swim_speed,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
      console.log(swim_speed_debug_log);

      this.value = swim_speed;
      this.percentage = delta;
      this.label = "{value} 距離単位/格".format({value: this.value.toFixed(4)});
      this.desc = "每一格距離単位";
      return this.value.toFixed(4);
    }, 2.4),

    'Run Speed': new Stat("行路速度", function(loadout) {
        var default_run_speed = null;
        var run_speed_parameters = null;
        if(loadout.weapon.speedLevel == 'Low') {
          run_speed_parameters = $scope.parameters["Run Speed"]["Heavy"];
        }
        if(loadout.weapon.speedLevel == 'Middle') {
          run_speed_parameters = $scope.parameters["Run Speed"]["Mid"];
        }
        if(loadout.weapon.speedLevel == "High") {
          run_speed_parameters = $scope.parameters["Run Speed"]["Light"];
        }

        var abilityScore = loadout.calcAbilityScore('Run Speed Up');        
        var p = this.calcP(abilityScore);       
        var s = this.calcS(run_speed_parameters);
        var run_speed = this.calcRes(run_speed_parameters, p, s);
        var delta = ((run_speed / run_speed_parameters[2] - 1) * 100).toFixed(1).toString();        
        
        // Debug log
        var run_speed_debug_log = {"Run Speed":run_speed,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
        console.log(run_speed_debug_log);

        this.value = run_speed;
        this.percentage = delta;
        this.label = "{value} 距離単位/格".format({value: this.value.toFixed(4)})
        this.desc = "每一格距離単位";
        return this.value.toFixed(4);
      }, 1.44),

    'Run Speed (Enemy Ink)': new Stat("行路速度 (敵方墨水上)", function(loadout) {
        // TODO: Verify these results with Leanny
        var ink_resistance_parameters = $scope.parameters["Ink Resistance"]["Run"];
        var abilityScore = loadout.calcAbilityScore('Ink Resistance Up');
        var p = this.calcP(abilityScore);       
        var s = this.calcS(ink_resistance_parameters);
        var run_speed = this.calcRes(ink_resistance_parameters, p, s);
        var delta = ((run_speed / ink_resistance_parameters[2] - 1) * 100).toFixed(1).toString();        
        
        // Debug log
        var run_speed_debug_log = {"Enemy Ink Run Speed":run_speed,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
        console.log(run_speed_debug_log);
        /*  Not sure why the old Loadout site had significantly different values for
            this stat then Leanny's formula. His follows the same results here:
            See: https://gamefaqs.gamespot.com/boards/200279-splatoon-2/75638591#5 
        */
        console.log("Ink Resist DEBUG: " + run_speed * loadout.weapon.baseSpeed)

        this.value = run_speed
        this.percentage = delta;
        this.label = "{value} 距離単位/格".format({value: this.value.toFixed(4)});
        this.desc = "每一格距離単位";
        return this.value.toFixed(4);
      }, 0.72),

    'Run Speed (Firing)': new Stat("行路速度 (開緊槍時)", function(loadout) {
      // TODO: Figure out rolling speed calculation  
      if(loadout.weapon.name.toLowerCase().indexOf('brush') != -1 || loadout.weapon.name.toLowerCase().indexOf('roller') != -1) {
          this.name = "行路速度 (油地時)"
          this.value = 0;
          this.label = "未有数字";
          this.desc = null;
          return this.value;
          //var speed = loadout.weapon.baseSpeed;
          //this.value = speed;
          //this.label = "{value} 距離単位/格".format({value: this.value.toFixed(2)});
          //return speed.toFixed(2);
        }
        else {
          this.name = "行路速度 (開緊槍時)"
        }

        var run_speed_parameters = $scope.parameters["Run Speed"]["Shooting"];
        var abilityScore = loadout.calcAbilityScore('Run Speed Up');
        var p = this.calcP(abilityScore);       
        var s = this.calcS(run_speed_parameters);
        var run_speed = this.calcRes(run_speed_parameters, p, s) * loadout.weapon.baseSpeed;
        var delta = ((run_speed / loadout.weapon.baseSpeed - 1) * 100).toFixed(1).toString();        

        // Debug log
        var run_speed_debug_log = {"Run Speed (Firing)":run_speed,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
        console.log(run_speed_debug_log);

        this.value = run_speed
        this.percentage = delta;
        this.label = "{value} 距離単位/格".format({value: this.value.toFixed(4)});
        this.desc = "每一格距離単位";
        if(isNaN(this.value)) {
          this.value = 0;
          this.label = "未有数字";
          this.desc = null;
        }
        return this.value.toFixed(4);
      }, 1.44),

    'Ink Recovery Speed (Squid)': new Stat("回墨速度 (墨魚)", function(loadout) {
      var ink_recovery_parameters = $scope.parameters["Ink Recovery Up"]["In Ink"];
      var abilityScore = loadout.calcAbilityScore('Ink Recovery Up');
      var p = this.calcP(abilityScore);       
      var s = this.calcS(ink_recovery_parameters);
      var refill_rate = this.calcRes(ink_recovery_parameters, p, s);
      var refill_time = refill_rate / 60;
      var delta = 3 / refill_time * 100;

      // Debug log
      var refill_speed_squid_debug_log = {"Ink Recovery Speed (Squid)":refill_rate,"time":refill_time,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
      console.log(refill_speed_squid_debug_log);

      this.value = delta;
      this.percentage = (100 - (100 / delta) * 100).toFixed(1);
      this.desc = "由空到滿需要{value}秒".format({value: refill_time.toFixed(2)})
      this.label = "{value}秒".format({value: refill_time.toFixed(2)})
      return this.value.toFixed(2);
    }, 154),

    'Ink Recovery Speed (Kid)': new Stat("回墨速度 (人形)", function(loadout) {
      var ink_recovery_parameters = $scope.parameters["Ink Recovery Up"]["Standing"];
      var abilityScore = loadout.calcAbilityScore('Ink Recovery Up');
      var p = this.calcP(abilityScore);       
      var s = this.calcS(ink_recovery_parameters);
      var refill_rate = this.calcRes(ink_recovery_parameters, p, s);
      var refill_time = refill_rate / 60;
      var delta = 10 / refill_time * 100;

      // Debug log
      var refill_speed_squid_debug_log = {"Ink Recovery Speed (Kid)":refill_rate,"time":refill_time,"AP":abilityScore,"P":p,"S":s,"Delta":delta}
      console.log(refill_speed_squid_debug_log);

      this.value = delta;
      this.percentage = (100 - (100 / delta) * 100).toFixed(1);
      this.desc = "由空到滿需要{value}秒".format({value: refill_time.toFixed(2)})      
      this.label = "{value}秒".format({value: refill_time.toFixed(2)})
      return this.value.toFixed(2);
    }, 273),

    'Ink Consumption (Main)': new Stat("墨水消耗 (主武器)", function(loadout) {
      var ink_saver_parameters = null;
      if(loadout.weapon.inkSaver == 'Low') {
        ink_saver_parameters = $scope.parameters["Ink Saver Main"]["Low"];
      }
      if(loadout.weapon.inkSaver == 'Middle') {
        ink_saver_parameters = $scope.parameters["Ink Saver Main"]["Mid"];
      }
      if(loadout.weapon.inkSaver == "High") {
        ink_saver_parameters = $scope.parameters["Ink Saver Main"]["High"];
      }

      var abilityScore = loadout.calcAbilityScore('Ink Saver (Main)');
      var p = this.calcP(abilityScore);       
      var s = this.calcS(ink_saver_parameters);
      var reduction = this.calcRes(ink_saver_parameters, p, s);
      
      var costPerShot = loadout.weapon.inkPerShot * reduction;
      this.desc = "射{totalShots}下就會無墨 (慳咗{reduction}%)".format({totalShots: Math.floor(100/costPerShot), reduction: (100 - (reduction*100)).toFixed(1)})
      this.label = "{value}% 箱/{unit}".format({value: $scope.toFixedTrimmed(costPerShot,3), unit: loadout.weapon.shotUnit})
      this.value = costPerShot;
      this.percentage = (100 - (reduction*100)).toFixed(1);

      // Debug log
      var ink_saver_debug_log = {"Ink Saver (Main)":costPerShot,"AP":abilityScore,"P":p,"S":s,"Delta":reduction}
      console.log(ink_saver_debug_log);

      if(isNaN(this.value)) {
        this.value = 0;
        this.label = "未有数字";
        this.desc = null;
      }
      return this.value;
    }, 100),

    'Ink Consumption (Sub)': new Stat("墨水消耗 (副武器)", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Ink Saver (Sub)');
      this.name = "墨水消耗 (副武器)"
      var coeff = (600 / 7)
      var sub = $scope.getSubByName(loadout.weapon.sub)
      if(sub.inkSaver == 'Low') coeff = 100
      var reduction =  this.calcMod(abilityScore) / coeff
      // TODO: Hacky 2.0 balance fix. Possibly inaccurate.
      switch(sub.name) {
        case 'Burst Bomb':
          reduction *= (2/3)
          this.name = "墨水消耗 (副武器) *"
          break
        case 'Toxic Mist':
          reduction *= 0.86
          this.name = "墨水消耗 (副武器) *"
          break
      }
      var costPerSub = sub.cost * (1 - reduction)
      this.value = costPerSub;
      this.localizedDesc = { reduction: reduction.toFixed(1), desc: 'DESC_SUB_COST' };
      this.desc = "慳咗{reduction}%".format({reduction: reduction.toFixed(1)})
      this.label = "{value}% 箱".format({value: this.value.toFixed(2)})
      return costPerSub;
    }, 100),
    'Special Charge Speed': new Stat("儲大招速度", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Special Charge Up');
      var chargeSpeed = (1 + this.calcMod(abilityScore) / 100)
      this.value = chargeSpeed;
      this.desc = "{value}p儲滿大招".format({value: Math.round(loadout.weapon.specialCost / chargeSpeed)})
      this.label = "{value}%".format({value: (this.value*100).toFixed(1)});
      return (chargeSpeed * 100).toFixed(1);
    }, 1.3),
    'Special Saved': new Stat("死亡後大招保留 *", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Special Saver');
      this.localizedDesc = { desc: null };
      var y = this.calcMod(abilityScore)
      var kept = (1/4500) * Math.pow(y,2) + (1/100)*y + 0.5
      if(loadout.hasAbility('Respawn Punisher')) {
        kept -= .225;
        this.desc = "技能死亡懲罰嘅效果並未完全了解";
      }
      this.value = kept;
      this.label = "{value}%".format({value: (this.value*100).toFixed(1)});
      return (kept * 100).toFixed(1);
    }, 1),
//TODO: clean this up a bit
    'Special Power': new Stat("大招威力", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Special Power Up');
      var equippedSpecial = $scope.getSpecialByName(loadout.weapon.special)
      var coeff = 0;
      var base = 0;
      var results = 0;
      this.desc = null;
      this.name = "大招威力<br>(???)"
      switch(equippedSpecial.name) {
        case 'Suction-Bomb Launcher':
        case 'Burst-Bomb Launcher':
        case 'Curling-Bomb Launcher':
        case 'Autobomb Launcher':
        case 'Splat-Bomb Launcher':
          coeff = 90;
          base = 360;
          this.max = 8.1;
          this.name = "大招威力<br>(時間)"
          results = (base * (1 +this.calcMod(abilityScore) / coeff))/60
          this.value = results;
          this.label = "{value}秒".format({value: this.value.toFixed(2)});
          return results.toFixed(2);
          break;
        case 'Ink Armor':
          coeff = 60;
          base = 360;
          this.max = 9;
          this.name = "大招威力<br>(時間)"
          results = (base * (1 +this.calcMod(abilityScore) / coeff))/60
          this.value = results;
          this.label = "{value}秒".format({value: this.value.toFixed(2)});
          return results.toFixed(2);
          break;
        case 'Inkjet':
        case 'Ink Storm':
        case 'Sting Ray':
          coeff = 120;
          base = 465;
          this.max = 10;
          this.name = "大招威力<br>(時間)"
          results = (base * (1 +this.calcMod(abilityScore) / coeff))/60
          this.value = results;
          this.label = "{value}秒".format({value: this.value.toFixed(2)});
          return results.toFixed(2);
          break;
        case 'Baller':
          coeff = 60;
          base = 400;
          this.max = 600;
          this.name = "大招威力<br>(波波HP)"
          results = (base * (1 +this.calcMod(abilityScore) / coeff))
          this.value = results;
          this.label = "{value} HP".format({value: this.value.toFixed(2)});
          return results.toFixed(1);
          break;
        case 'Tenta Missiles':
          coeff = 45;
          base = 4.8;
          this.max = 8;
          this.max = '166'
          this.name = "大招威力<br>(大細)"
          results = (1 +this.calcMod(abilityScore) / coeff)*100
          this.value = results;
          this.label = "{value}%".format({value: this.value.toFixed(1)})
          return results.toFixed(1);
          break;
        case 'Splashdown':
          coeff = 110;
          base = 110;
          this.max = 1.274;
          this.name = "大招威力<br>(爆地直径)"
          results = (1 +this.calcMod(abilityScore) / coeff)
          this.desc = "{value}距離単位".format({value: (base*results).toFixed(1)})
          this.value = results;
          this.label = "{value}%".format({value: (results*100).toFixed(1)})
          return (results*100).toFixed(1);
          break;
        case 'Bubble Blower':
          this.name = "大招威力<br>(泡泡半径)";
          this.value = 0;
          this.label = "未有数字";
          break;
      }
      return results;
    }, 100),
//TODO: get effects for all subs
    'Sub Power': new Stat("副武器威力", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Sub Power Up');
      var equippedSub = $scope.getSubByName(loadout.weapon.sub)
      this.name = "副武器威力<br>(範囲)"
      this.value = 0;
      switch(equippedSub.name) {
        case 'Burst Bomb':
        case 'Splat Bomb':
        case 'Suction Bomb':
        case 'Autobomb':
        case 'Point Sensor':
        case 'Toxic Mist':
          var range = (1 + this.calcMod(abilityScore) / 60)
          this.value = range*100;
          this.label = "{value}%".format({value: this.value.toFixed(1)})
          this.name = "副武器威力<br>(範囲)";
          this.max = 150;
          return (range * 100).toFixed(1);
          break;
        case 'Curling Bomb':
          this.name = "副武器威力<br>(移速)";
          this.label = "未有数字";
          break;
        case 'Ink Mine':
          this.name = "副武器威力<br>(地雷半径)";
          this.label = "未有数字";
          break;
        case 'Splash Wall':
          this.name = "副武器威力<br>(水簾HP)";
          this.label = "未有数字";
          var HP = 800 * (1 + this.calcMod(abilityScore) / (240/7))
          this.value = HP;
          this.label = "{value} HP".format({value: this.value.toFixed(2)});
          this.max = 1500;
          break;
        case 'Sprinkler':
          this.name = "副武器威力<br>(最大水輸出時間)";
          this.label = "未有数字";
          break;
        case 'Squid Beakon':
          this.name = "副武器威力<br>(飛行速度)";
          this.label = "未有数字";
          break;
      }
      return (range * 100).toFixed(1);
    }, 150),
    'Super Jump Time (Squid)': new Stat("超級跳躍時間 (墨魚) *", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Quick Super Jump');
      var mod = this.calcMod(abilityScore)
      var totalFrames = (-1/75)*Math.pow(mod,2) - (84/25)*mod + 218
      this.value = (totalFrames) / 60
      this.label = "{value}秒".format({value: this.value.toFixed(2)});
      return ((totalFrames) / 60).toFixed(2);
    }, 3.65),
    'Super Jump Time (Kid)': new Stat("超級跳躍時間 (人形) *", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Quick Super Jump');
      var mod = this.calcMod(abilityScore)
      var totalFrames = (-1/75)*Math.pow(mod,2) - (84/25)*mod + 239
      this.value = totalFrames / 60
      this.label = "{value}秒".format({value: this.value.toFixed(2)});
      return (totalFrames / 60).toFixed(2);
    }, 4),
    //TODO: This is WRONG! Need more data on Respawn Punisher!
    'Quick Respawn Time': new Stat("回復時間", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Quick Respawn');
      this.name = "回復時間";
      this.desc = "無殺其他人嘅復回時間";
      var death = 30;
      var splatcam = 354;
      var spawn = 120;
      var mod = this.calcMod(abilityScore)/60
      if(loadout.hasAbility('Respawn Punisher')) {
        this.name = "回復時間 * *";
        this.desc = "技能死亡懲罰嘅效果並未完全了解";
        mod *= 0.5;
        splatcam += 74;
      }
      var spawnFrames = death + (splatcam*(1-mod)) + spawn;
      this.value = spawnFrames/60
      this.label = "{value}秒".format({value: this.value.toFixed(2)});
      return this.value.toFixed(2)
    }, 9.6),
    'Tracking Time': new Stat("追跡時間 *", function(loadout) {
      var abilityScore = loadout.calcAbilityScore('Cold-Blooded');
      var trackReduction = this.calcMod(abilityScore) / 40
      this.value = (8 * (1 - trackReduction))
      this.label = "{value}秒".format({value: this.value.toFixed(2)});
      this.desc = "有效時間";
      return (8 * (1 - trackReduction)).toFixed(2);
    }, 8)
  }


  $scope.getStatByName = function(name) {
    return $scope.stats[name]
  }
  $scope.getAdjustedSubSpeDamage = function(sub,loadout) {
  var abilityScore = loadout.calcAbilityScore('Bomb Defense Up');
  var coeff;
  switch(sub.name) {
    case 'Burst Bomb':
      coeff = 75;
      break;
    case 'Splat Bomb':
    case 'Suction Bomb':
    case 'Autobomb':
    case 'Curling Bomb':
    case 'Ink Mine':
      coeff = 60;
      break;
    default:
      coeff = (600/7);
      break;
  }
  var damageReduction = (1 - (0.99 * abilityScore - Math.pow(0.09 * abilityScore,2)) / coeff)
    var results = {}
    for(damageValue in sub.damage) {
      var subDamage = sub.damage[damageValue]
      if(subDamage >= 100) {
        results[damageValue] = subDamage.toFixed(1);
      } else {
        results[damageValue] = (subDamage * damageReduction).toFixed(1);
      }
    }
    return results
  }
  $scope.getAdjustedSpecialCost = function(loadout) {
    var stat = $scope.getStatByName('Special Charge Speed');
    return Math.floor(loadout.weapon.specialCost / (stat.value))
  }
}
