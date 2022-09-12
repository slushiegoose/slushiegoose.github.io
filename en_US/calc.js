angular
    .module('splatApp', ['ui.bootstrap', 'ngAnimate', 'ngAria', 'rzSlider'])
    .controller('splatController', ['$scope', '$rootScope', '$timeout', '$locale', function splatCtrl($scope, $rootScope, $timeout, $locale, $translate, $uibModal, $log) {
        $rootScope.splatController = $scope;
        angular.module('splatApp').skills($scope);
        angular.module('splatApp').weapons($scope);
        angular.module('splatApp').subs($scope);
        angular.module('splatApp').specials($scope);
        angular.module('splatApp').gear($scope);
        angular.module('splatApp').clipboard($scope, $timeout);
        angular.module('splatApp').util($scope);

        $scope.loadout = new Loadout();
        $scope.status = {}
        $scope.logging = false;
        $scope.appVersion = 100; // 2.X.X
        $scope.screenshotMode = false;
        $scope.toggledAbilities = {};

        $scope.ldeSlider = {
            visible: false,
            value: 50,
            options: {
                floor: 30,
                ceil: 50,
                disabled: true,
                showSelectionBar: true
            }
        };

        $scope.tutorial = angular.module('splatApp').tutorial;

        $scope.appVersionToString = function() {
            var appVersionString = "";
            for (i = 0; i < $scope.appVersion.toString().length; i++) {
                appVersionString += $scope.appVersion.toString()[i];
                if (i < $scope.appVersion.toString().length - 1) {
                    appVersionString += ".";
                }
            }
            return appVersionString;
        }

        $scope.getCurrentLang = function() {
            var current_lang = window.location.pathname;
            while (current_lang.indexOf("/") != -1) {
                current_lang = current_lang.replace("/", "");
            }
            return current_lang;
        }

        $scope.saveToggledAbility = function(weaponType, statName, statKey) {
            if ($scope.toggledAbilities[weaponType] == null) {
                $scope.toggledAbilities[weaponType] = {};
            }
            $scope.toggledAbilities[weaponType][statKey] = statName;
        }

        $scope.loadSavedToggledAbilities = function() {
            var weaponNameKeys = Object.keys($scope.toggledAbilities);

            for (var i = 0; i < weaponNameKeys.length; i++) {
                if (weaponNameKeys[i] == $scope.loadout.weapon.name) {
                    var weaponName = weaponNameKeys[i];
                    var statKeyKeys = Object.keys($scope.toggledAbilities[weaponName]);

                    for (var j = 0; j < statKeyKeys.length; j++) {
                        var statKey = statKeyKeys[j];
                        var statName = $scope.toggledAbilities[weaponName][statKey];

                        // TODO: The value stored should be a dictionary of the Stat Name and Ability Name
                        var abilityName = null;
                        if (statKey.indexOf("Main Power Up") != -1) {
                            abilityName = "Main Power Up";
                        }
                        if (statKey == "Special Saved") {
                            abilityName = "Special Saver";
                        }
                        if (statKey == "Sub Power") {
                            abilityName = "Sub Power Up";
                        }
                        if (statKey == "Run Speed (Firing)") {
                            abilityName = "Run Speed Up";
                        }
                        if (statKey == "Ink Consumption (Main)") {
                            abilityName = "Ink Saver (Main)";
                        }

                        var abilityScore = $scope.loadout.calcAbilityScore(abilityName);
                        var statValues = $scope.calcStat(abilityScore, weaponName, statName);
                        $scope.displayStat(statKey, statValues.name, statValues.value, statValues.percentage, statValues.label);
                    }
                    break;
                }
            }
        }

        $scope.checkIfToggledAbilityActive = function(name) {
            var weaponTypeKeys = Object.keys($scope.toggledAbilities);

            for (var i = 0; i < weaponTypeKeys.length; i++) {
                if (weaponTypeKeys[i] == $scope.loadout.weapon.type) {
                    var weaponType = weaponTypeKeys[i];
                    var statKeyKeys = Object.keys($scope.toggledAbilities[weaponType]);

                    for (var j = 0; j < statKeyKeys.length; j++) {
                        var statKey = statKeyKeys[j];
                        var statName = $scope.toggledAbilities[weaponType][statKey];

                        if (statName == name) {
                            return true;
                        }
                    }
                }
                break;
            }
            return false;
        }

        $scope.resetConditionalAbilities = function() {
            if (!$scope.loadout.hasAbility("Opening Gambit")) {
                $scope.setConditionalAbilitySelected("Opening Gambit", false);
            }
            if (!$scope.loadout.hasAbility("Last-Ditch Effort")) {
                $scope.setConditionalAbilitySelected("Last-Ditch Effort", false);
                $scope.ldeSlider.visible = false;
                $scope.ldeSlider.value = 50;
            }
            if (!$scope.loadout.hasAbility("Comeback")) {
                $scope.setConditionalAbilitySelected("Comeback", false);
            }
            if (!$scope.loadout.hasAbility("Drop Roller")) {
                $scope.setConditionalAbilitySelected("Drop Roller", false);
            }
        }

        $scope.toggleConditionalAbilityCheckbox = function() {
            if ($scope.loadout.hasAbility("Opening Gambit")) {
                // 1. Modify the Swim Speed stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Swim Speed Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SWIM_SPEED");
                $scope.displayStat("Swim Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 2. Modify the Run Speed stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED");
                $scope.displayStat("Run Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 3. Modify the Ink Resistance (Run Speed) stat.
                abilityScore = $scope.loadout.calcAbilityScore('Ink Resistance Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED_RESIST");
                $scope.displayStat("Run Speed (Enemy Ink)", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 4. Modify the Run Speed Firing stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED_FIRING");
                $scope.displayStat("Run Speed (Firing)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);
            }

            if ($scope.loadout.hasAbility("Comeback")) {
                // 1. Modify the Swim Speed stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Swim Speed Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SWIM_SPEED");
                $scope.displayStat("Swim Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 2. Modify the Run Speed stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED");
                $scope.displayStat("Run Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 3. Modify the Run Speed (Firing) stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED_FIRING");
                $scope.displayStat("Run Speed (Firing)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 1. Modify the Ink Consumption (Main) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Saver (Main)');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SAVER_MAIN");
                $scope.displayStat("Ink Consumption (Main)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 2. Modify the Ink Consumption (Sub) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Saver (Sub)');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SAVER_SUB");
                $scope.displayStat("Ink Consumption (Sub)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 3. Modify the Ink Recovery Speed (Squid) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Recovery Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RECOVERY_SQUID");
                $scope.displayStat("Ink Recovery Speed (Squid)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 4. Modify the Ink Recovery Speed (Kid) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Recovery Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RECOVERY_KID");
                $scope.displayStat("Ink Recovery Speed (Kid)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 8. Modify the Special Charge Speed stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Special Charge Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SPECIAL_CHARGE");
                $scope.displayStat("Special Charge Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);
            }

            if ($scope.loadout.hasAbility("Last-Ditch Effort")) {
                $scope.ldeSlider.visible = true;
                $timeout(function() {
                    $scope.$broadcast('rzSliderForceRender');
                });

                if ($scope.conditionalAbilitySelected("Last-Ditch Effort")) {
                    $scope.ldeSlider.options.disabled = false;
                } else {
                    $scope.ldeSlider.options.disabled = true;
                }

                // 1. Modify the Ink Consumption (Main) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Saver (Main)');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SAVER_MAIN");
                $scope.displayStat("Ink Consumption (Main)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 2. Modify the Ink Consumption (Sub) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Saver (Sub)');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SAVER_SUB");
                $scope.displayStat("Ink Consumption (Sub)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 3. Modify the Ink Recovery Speed (Squid) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Recovery Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RECOVERY_SQUID");
                $scope.displayStat("Ink Recovery Speed (Squid)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);

                // 4. Modify the Ink Recovery Speed (Kid) stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Ink Recovery Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RECOVERY_KID");
                $scope.displayStat("Ink Recovery Speed (Kid)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);
            } else {
                $scope.ldeSlider.visible = false;
            }

            if ($scope.loadout.hasAbility("Drop Roller")) {
                // 1. Modify the Swim Speed stat.
                var abilityScore = $scope.loadout.calcAbilityScore('Swim Speed Up');
                var statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_SWIM_SPEED");
                $scope.displayStat("Swim Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 2. Modify the Run Speed stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED");
                $scope.displayStat("Run Speed", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 3. Modify the Ink Resistance (Run Speed) stat.
                abilityScore = $scope.loadout.calcAbilityScore('Ink Resistance Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED_RESIST");
                $scope.displayStat("Run Speed (Enemy Ink)", statValues.name, statValues.value, statValues.percentage, statValues.label);

                // 4. Modify the Run Speed Firing stat.
                abilityScore = $scope.loadout.calcAbilityScore('Run Speed Up');
                statValues = $scope.calcStat(abilityScore, $scope.loadout.weapon.type, "STAT_RUN_SPEED_FIRING");
                $scope.displayStat("Run Speed (Firing)", statValues.name, statValues.value, statValues.percentage, statValues.label, statValues.desc);
            }
        }

        $scope.ldeSlider.options.onChange = function() {
            $scope.toggleConditionalAbilityCheckbox();
        }

        $scope.calcLDEBonus = function() {
            var score = $scope.ldeSlider.value;
            if (score == 50) {
                score = 0;
            } else {
                score = (50 - score) + 1;
            }
            return Math.floor(Math.min(24, 8 * score / 7));
        }

        $scope.switchSet = function() {
            $scope.loadout.weapon = $scope.availableWeapons()[0];
        }

        $scope.availableWeapons = function() {
            return $scope.selectedSet.weapons.filter(filter_available)
        }

        $scope.selectedSet = $scope.weaponSets[0];
        $scope.loadout.weapon = $scope.availableWeapons()[0];
        $scope.loadout.head.equipped = $scope.hats[0];
        $scope.loadout.clothes.equipped = $scope.clothes[0];
        $scope.loadout.shoes.equipped = $scope.shoes[0];

        $scope.$watch('loadout', function() {
            $scope.resetConditionalAbilities();
            $scope.loadSavedToggledAbilities();
            history.replaceState(undefined, undefined, "#" + $scope.encodeLoadout());
        }, true);

        $scope.encodeLoadout = function() {
            return encode($scope.selectedSet.id, $scope.loadout)
        }

        $scope.loadCode = function(code) {
            var newLoadout = new Loadout();
            var results = decode(code)
            if (results) {
                $scope.selectedSet = $scope.getWeaponSetById(results.set)
                newLoadout.weapon = $scope.getWeaponById(results.set, results.weapon)
                newLoadout.head.equipped = $scope.getHatById(results.head.gear)
                newLoadout.clothes.equipped = $scope.getClothesById(results.clothes.gear)
                newLoadout.shoes.equipped = $scope.getShoesById(results.shoes.gear)
                newLoadout.head.main = $scope.getSkillById(results.head.main)
                for (var i = 0; i < 3; i++) {
                    newLoadout.head.subs[i] = $scope.getSkillById(results.head.subs[i])
                }
                newLoadout.clothes.main = $scope.getSkillById(results.clothes.main)
                for (var i = 0; i < 3; i++) {
                    newLoadout.clothes.subs[i] = $scope.getSkillById(results.clothes.subs[i])
                }
                newLoadout.shoes.main = $scope.getSkillById(results.shoes.main)
                for (var i = 0; i < 3; i++) {
                    newLoadout.shoes.subs[i] = $scope.getSkillById(results.shoes.subs[i])
                }

                return newLoadout
            }
            return false;
        }

        $scope.encodedURL = function() {
            return window.location.protocol + "//" + window.location.hostname + "/#" + $scope.encodeLoadout()
        }

        $scope.randomizeBuild = function() {
            var randomized = new Loadout()
            $scope.selectedSet = randomFrom($scope.weaponSets)
            randomized.weapon = randomFrom($scope.availableWeapons())
            randomized.head.equipped = randomFrom($scope.hats)
            randomized.clothes.equipped = randomFrom($scope.clothes)
            randomized.shoes.equipped = randomFrom($scope.shoes)
            $scope.loadout = randomized;
        }

        $scope.resetLoadout = function() {
            $scope.selectedSet = $scope.weaponSets[0];
            $scope.loadout.weapon = $scope.availableWeapons()[0];
            $scope.loadout.head.equipped = $scope.hats[0];
            $scope.loadout.clothes.equipped = $scope.clothes[0];
            $scope.loadout.shoes.equipped = $scope.shoes[0];
            $scope.loadout.clearAbilities();
        }

        if (window.location.hash) {
            var newLoadout = $scope.loadCode(window.location.hash.replace('#', ''))
            if (newLoadout) {
                $scope.loadout = newLoadout;
            }
        }

        $scope.equip = function(item, slot) {
            if (eval("$scope.loadout." + slot + ".main") == null || eval("$scope.loadout." + slot + ".equipped.name") == "Splatfest Tee" || item.name == "Splatfest Tee") {
                eval(("$scope.loadout." + slot + ".main = $scope.getSkillByName('" + item.main + "')"))
            }
            eval("$scope.loadout." + slot + ".equipped = item")
        }

        $scope.getActiveConditionalAbilities = function() {
            var activeConditionalAbilities = [];
            for (var i = 0; i < $scope.skills.length; i++) {
                if ($scope.skills[i].conditional && $scope.loadout.hasAbility($scope.skills[i].name)) {
                    activeConditionalAbilities.push($scope.skills[i]);
                }
            }

            $scope.activeConditionalAbilities = activeConditionalAbilities;
            return activeConditionalAbilities;
        }

        $scope.conditionalAbilitySelected = function(ability) {
            if ($scope.activeConditionalAbilities) {
                for (var i = 0; i < $scope.activeConditionalAbilities.length; i++) {
                    if ($scope.activeConditionalAbilities[i].name == ability) {
                        return $scope.activeConditionalAbilities[i].selected;
                    }
                }
            }
            return false;
        }

        $scope.setConditionalAbilitySelected = function(ability, value) {
            if ($scope.activeConditionalAbilities) {
                for (var i = 0; i < $scope.activeConditionalAbilities.length; i++) {
                    if ($scope.activeConditionalAbilities[i].name == ability) {
                        $scope.activeConditionalAbilities[i].selected = value;
                    }
                }
            }
        }

        $scope.toFixedTrimmed = function(number, precision) {
            return Number(number.toFixed(precision)).toString();
        }

        $scope.calcMod = function(abilityScore) {
            return (0.99 * abilityScore - Math.pow(0.09 * abilityScore, 2));
        }

        $scope.calcP = function(abilityScore) {
            return Math.min(3.3 * abilityScore - 0.027 * Math.pow(abilityScore, 2), 100);
        }

        $scope.calcS = function(values) {
            var max = values[0];
            var mid = values[1];
            var min = values[2];
            return (mid - min) / (max - min);
        }

        $scope.calcRes = function(values, p, s) {
            var max = values[0];
            var mid = values[1];
            var min = values[2];
            return min + (max - min) * this.lerpN(p / 100, s);
        }

        $scope.lerpN = function(p, s) {
            if (s.toFixed(3) == 0.5) {
                return p;
            }
            if (p == 0.0) {
                return p;
            }
            if (p == 1.0) {
                return p;
            }
            if (s != 0.5) {
                return Math.pow(Math.E, -1 * (Math.log(p) * Math.log(s) / Math.log(2)))
            }
        }

        $scope.statValuesToDict = function(name, value, percentage, label, desc) {
            return {
                "name": name,
                "value": value,
                "percentage": percentage,
                "label": label,
                "desc": desc
            };
        }

        $scope.displayStat = function(key, name, value, percentage, label, desc) {
            $scope.stats[key].name = name;
            $scope.stats[key].value = value;
            $scope.stats[key].percentage = percentage;
            $scope.stats[key].label = label;

            if (desc != null) {
                $scope.stats[key].desc = desc;
            }
        }


        // TODO: Re-enable these when localisations are updated.
        $scope.languages = {
            'en_US': 'English',
            'ja_JP': '日本語',
            // 'es_ES': 'Español (ES)',
            // 'es_MX': 'Español (MX)',
            // 'fr_FR': 'Français (FR)',
            // 'fr_CA': 'Français (CA)',
            // 'it_IT': 'Italiano',
            // 'zh_HK': '中文 (香港)'
        }




    }])
    .filter("trust", ['$sce', function($sce) {
        return function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]);