import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import { visualEditorVisible } from '../src/stores';
import { render, fireEvent } from '@testing-library/svelte';

import HideVisualEditorButton from '../src/Components/Buttons/HideVisualEditorButton.svelte'

describe('Hide Visual Editor Button', () => {
    it('Should toggle visualEditorVisible store when clicked', async () => {
        let startVisible = get(visualEditorVisible)

        const { getByRole } = render(HideVisualEditorButton)

        // Get the button and simulate a click
        const button = getByRole('button')
        await fireEvent.click(button)

        let newVisible = get(visualEditorVisible)
        expect(newVisible).toBe(!startVisible)
    })

})