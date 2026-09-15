<?php

test('the public landing page renders for visitors', function () {
    config(['app.base_domain' => 'school-system.test']);

    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('authUrl', 'http://auth.school-system.test')
        ->has('name')
    );
});
