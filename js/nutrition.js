/**
 * Nutrition landing page: intake calculator + meal plan form.
 * Cursor z-index is above all content (shared.css).
 */
const MEAL_PLAN_FORMS_KEY = 'ethan_cope_meal_plan_forms';

// Height: feet + inches, auto total display
const heightFtEl = document.getElementById('height-ft');
const heightInEl = document.getElementById('height-in');
const heightTotalEl = document.getElementById('height-total-in');
function updateHeightTotal() {
    if (!heightTotalEl) return;
    const ft = parseInt(heightFtEl?.value || 0, 10);
    const inch = parseInt(heightInEl?.value || 0, 10);
    const total = ft * 12 + inch;
    heightTotalEl.textContent = total > 0 ? 'Total: ' + total + ' in' : 'Total: - in';
}
heightFtEl?.addEventListener('input', updateHeightTotal);
heightInEl?.addEventListener('input', updateHeightTotal);

// Nutrition calculator: Mifflin-St Jeor BMR, height from ft + in
const nutritionForm = document.getElementById('nutrition-form');
if (nutritionForm) {
    nutritionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const ft = parseInt(document.getElementById('height-ft')?.value || 0, 10);
        const inch = parseInt(document.getElementById('height-in')?.value || 0, 10);
        const heightIn = ft * 12 + inch;
        const weightLbs = parseFloat(document.getElementById('weight-lbs').value, 10);
        const age = parseFloat(document.getElementById('age').value, 10);
        const sex = document.getElementById('sex').value;
        const activityFactor = parseFloat(document.getElementById('activity').value, 10);
        if (!heightIn || heightIn < 48 || !weightLbs || !age) return;
        const heightCm = heightIn * 2.54;
        const weightKg = weightLbs / 2.205;
        let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
        bmr += sex === 'm' ? 5 : -161;
        const tdee = Math.round(bmr * activityFactor);
        const proteinLow = Math.round(weightKg * 1.6);
        const proteinHigh = Math.round(weightKg * 2.2);
        const deficit = 500;
        const surplus = 300;
        document.getElementById('calories-maintenance').textContent = tdee.toLocaleString() + ' cal';
        document.getElementById('protein-maintenance').textContent = proteinLow + '–' + proteinHigh + ' g';
        document.getElementById('calories-loss').textContent = (tdee - deficit).toLocaleString() + ' cal';
        document.getElementById('protein-loss').textContent = proteinLow + '–' + proteinHigh + ' g';
        document.getElementById('calories-gain').textContent = (tdee + surplus).toLocaleString() + ' cal';
        document.getElementById('protein-gain').textContent = proteinLow + '–' + proteinHigh + ' g';
        document.getElementById('nutrition-results').classList.remove('hidden');
        document.getElementById('meal-plan-age').value = age;
        document.getElementById('meal-plan-height-in').value = heightIn;
        document.getElementById('meal-plan-weight').value = weightLbs;
    });
}

// Meal plan CTA: toggle form
const mealPlanCtaBtn = document.getElementById('meal-plan-cta-btn');
const mealPlanFormWrap = document.getElementById('meal-plan-form-wrap');
if (mealPlanCtaBtn && mealPlanFormWrap) {
    mealPlanCtaBtn.addEventListener('click', () => {
        mealPlanFormWrap.classList.toggle('hidden');
    });
}

// Meal plan form: save to localStorage for admin
const mealPlanForm = document.getElementById('meal-plan-form');
if (mealPlanForm) {
    mealPlanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const age = document.getElementById('meal-plan-age').value || document.getElementById('age')?.value;
        const heightIn = document.getElementById('meal-plan-height-in').value || (function() {
            const ft = parseInt(document.getElementById('height-ft')?.value || 0, 10);
            const inch = parseInt(document.getElementById('height-in')?.value || 0, 10);
            return ft * 12 + inch;
        })();
        const weight = document.getElementById('meal-plan-weight').value || document.getElementById('weight-lbs')?.value;
        const name = document.getElementById('meal-plan-name').value.trim();
        const email = document.getElementById('meal-plan-email').value.trim();
        const goals = document.getElementById('meal-plan-goals').value.trim();
        const exerciseHistory = document.getElementById('meal-plan-exercise-history').value.trim();
        let list = [];
        try {
            const raw = localStorage.getItem(MEAL_PLAN_FORMS_KEY);
            if (raw) list = JSON.parse(raw);
        } catch (_) {}
        list.push({
            name, email, goals, exerciseHistory,
            age, heightIn: String(heightIn), weight,
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem(MEAL_PLAN_FORMS_KEY, JSON.stringify(list));
        mealPlanForm.reset();
        document.getElementById('meal-plan-age').value = age;
        document.getElementById('meal-plan-height-in').value = heightIn;
        document.getElementById('meal-plan-weight').value = weight;
        alert('Application submitted. We\'ll be in touch.');
    });
}
