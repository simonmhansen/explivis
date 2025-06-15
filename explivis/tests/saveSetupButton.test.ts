import { describe, it, expect, vi } from 'vitest';
import { chartHandler, nodeCreatedObserver, nodes, saveHandler } from '../src/stores'
import { get } from 'svelte/store';
import { render, fireEvent } from '@testing-library/svelte';
import SaveSetupButton from '../src/Components/Buttons/SaveSetupButton.svelte'
import { beforeEach, afterEach } from 'node:test';


beforeEach(() => {
    global.fetch = vi.fn(() => 
        Promise.resolve({
            json : () => Promise.resolve({}),
        })
    );
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Save Setup Button', () => {
    it('Should call save setup when clicking button', async () => {
 
        const saveHandlerNewChartSpy = vi.spyOn(saveHandler, 'saveSetup').mockImplementation(() => { return {encoding : "dummy"}});
        const { getByRole } = render(SaveSetupButton)

        // Get the button and simulate a click
        const button = getByRole('button')
        await fireEvent.click(button)

        expect(saveHandlerNewChartSpy).toHaveBeenCalledTimes(1)
    })
})

