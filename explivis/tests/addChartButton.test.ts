import { describe, it, expect, vi } from 'vitest';
import { chartHandler, nodeCreatedObserver, nodes } from '../src/stores'
import { get } from 'svelte/store';
import { render, fireEvent } from '@testing-library/svelte';
import AddChartButton from '../src/Components/Buttons/AddChartButton.svelte'

describe('Add Chart Button', () => {
    it('Should add new node when calling addNewChart', async () => {
        let startNumberOfNodes = get(nodes).length
        let nodeCreatedObserverResult = get(nodeCreatedObserver)
        chartHandler.addNewChart()

        let newNumberOfNodes = get(nodes).length
        expect(newNumberOfNodes).toBe(startNumberOfNodes + 1)
        expect(get(nodeCreatedObserver) !== nodeCreatedObserverResult).toBeTruthy() // A new event should be in the store
    })

    it('Should call addNewChart when clicked', async () => {
        const chartHandlerNewChartSpy = vi.spyOn(chartHandler, 'addNewChart').mockImplementation(() => {});
        const { getByRole } = render(AddChartButton)

        // Get the button and simulate a click
        const button = getByRole('button')
        await fireEvent.click(button)

        expect(chartHandlerNewChartSpy).toHaveBeenCalledTimes(1)
    })


})